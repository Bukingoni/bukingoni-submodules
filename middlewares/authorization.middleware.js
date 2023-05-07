const jsonwebtoken = require('jsonwebtoken');
const { promisify } = require('util');

const config = require('@config');
const logger = require('../utils/logger');

const commonUtils = require('../utils/common');
const permissionUtils = require('../utils/permission');
const sendResponse = require('../utils/response');

const { API_ERROR } = require("../constants");

const services = require('../services');

const verifyToken = promisify(jsonwebtoken.verify);
module.exports = async (req, res, next) => {
    try {
        const params = req?.IncomingParams;
        const tokenData = await verifyToken(params.Token, config.server.tokenSecret);

        const UserSessionID = tokenData?.SessionID;
        if (!UserSessionID) {
            res.OutgoingParams = { status: 400, key: API_ERROR.SESSION_NOT_FOUND, message: `Session not found.` };
            return sendResponse(req, res, next);
        }
        // Find user session with given user session id (extracted from token)
        const userSession = await services.findOne({ where: { UserSessionID: UserSessionID, Status: 'active' }, raw: false }, "UserSession");
        if (!userSession) {
            res.OutgoingParams = { status: 400, key: API_ERROR.SESSION_NOT_FOUND, message: `Session not found.` };
            return sendResponse(req, res, next);
        }

        // Check if it's expired
        if (commonUtils.getUnixTimestamp(userSession?.ExpiresAt) <= commonUtils.getUnixTimestamp(new Date())) {
            await userSession?.update({ Status: 'inactive' });
            res.OutgoingParams = { status: 400, key: API_ERROR.SESSION_EXPIRED, message: `Session expired.` };
            return sendResponse(req, res, next);
        }

        // Extend expire time of user session if there is less than 24 hours left until ExpiresAt
        if (commonUtils.getUnixTimestamp(userSession?.ExpiresAt) - commonUtils.getUnixTimestamp(new Date()) < 24 * 3600) {
            await userSession?.update({ ExpiresAt: commonUtils.extendTime(new Date(), userSession?.TokenExtendTime, 'h') });
        }

        const user = await services.findOne({
            where: { UserID: userSession?.UserID },
            include: [
                { EntityName: 'UserSetting', as: 'Settings' },
                { EntityName: 'Employee', as: 'Employee' }
            ],
            raw: false
        }, "User");

        if (!user || user?.Deleted || user?.Status === 'inactive') {
            await userSession?.update({ Status: 'inactive' });
            res.OutgoingParams = { status: 400, key: API_ERROR.SESSION_NOT_FOUND, message: `Session not found.` };
            return sendResponse(req, res, next);
        }

        const Permissions = await permissionUtils.findPermissions(user.UserID);
        const accessAllCustomers = permissionUtils.hasPermission('customers_list', Permissions);

        const customer = await services.findOne({ where: { CustomerID: userSession?.CustomerID }, raw: false }, "Customer");
        if (!accessAllCustomers && (!customer || customer?.Deleted || customer?.Status === 'inactive')) {
            await userSession?.update({ Status: 'inactive' });
            res.OutgoingParams = { status: 400, key: API_ERROR.SESSION_NOT_FOUND, message: `Session not found.` };
            return sendResponse(req, res, next);
        }

        if (!accessAllCustomers && (params.CustomerID && params.CustomerID !== customer.CustomerID && user.CustomerID)) { // Security check
            // If user is not admin, then check if user belongs to given customer, if not set it to user session customer
            // if user is system admin, will not set customer to session customer
            params.CustomerID = userSession?.CustomerID;
        }

        // Set authorization variable for api controllers
        req.AuthorizationSession = {
            UserSession: userSession,
            Customer: customer,
            User: user,
            Permissions,
            accessAllCustomers
        };
        next();
    } catch (error) {
        logger.error(error);
        res.OutgoingParams = { status: 403, key: API_ERROR.JWT_VERIFICATION_FAILED, message: `JWT Verification failed.` };
        sendResponse(req, res, next);
    }
}