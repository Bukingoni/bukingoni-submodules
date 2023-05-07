const logger = require('../utils/logger');

const permissionUtils = require('../utils/permission');
const { API_ERROR } = require("../constants");

const sendResponse = require('../utils/response');

module.exports = async (req, res, next) => {
    try {
        const BaseURL = req?.baseUrl?.split('/')[1] ?? null;
        const path = req?.route?.path ?? null;
        const methods = req?.route?.methods ?? {};
        if (!BaseURL || !path) {
            throw 'BaseURL or Path not specified.';
        }

        let permissionEntity = BaseURL.includes('-') ? BaseURL.replace(/-/g, '_') : BaseURL;
        let permissionAction = '';
        let requiredPermission = '';

        if (path !== '/' && !(path.includes(':') && path.split('/').length > 1)) {
            permissionAction = path.split('/')[1].replace(/-/g, '_');
            requiredPermission = `${permissionEntity}_${permissionAction}`;
            if (!permissionUtils.hasPermission(requiredPermission, req?.AuthorizationSession?.Permissions)) {
                res.OutgoingParams = { status: 403, key: API_ERROR.AUTH_FAILED, message: `You don't have permission to ${requiredPermission}.` };
                return sendResponse(req, res, next);
            }
            return next();
        }

        switch (true) {
            case !!(methods?.get):
                permissionAction = path?.includes(':') ? 'load' : 'list';
                break;
            case !!(methods?.post):
                permissionAction = 'create';
                break;
            case !!(methods?.put):
                permissionAction = 'update';
                break;
            case !!(methods?.delete):
                permissionAction = 'delete';
                break;
            default:
                throw 'Request method not specified.';
        }

        requiredPermission = `${permissionEntity}_${permissionAction}`;

        if (!permissionUtils.hasPermission(requiredPermission, req?.AuthorizationSession?.Permissions)) {
            res.OutgoingParams = { status: 403, key: API_ERROR.AUTH_FAILED, message: `You don't have permission to ${requiredPermission}.` };
            return sendResponse(req, res, next);
        }
        next();
    } catch (error) {
        logger.error(`[MIDDLEWARE|PERMISSION]: ${error?.message ?? error}`);
        res.OutgoingParams = { status: 403, key: API_ERROR.AUTH_FAILED, message: `Permission Verification failed.` };
        return sendResponse(req, res, next);
    }
}