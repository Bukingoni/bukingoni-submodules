const formidable = require('formidable');
const useragent = require('express-useragent')
const { v4: uuidv4 } = require('uuid');

const logger = require("./logger");

module.exports = (req, res, next) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const ua = useragent.parse(req?.headers?.['user-agent'] || '');
        const userAgentInformation = {
            browser: ua.browser,
            browserVersion: ua.version,
            os: ua.os,
            platform: ua.platform,
            ip: req?.headers?.['X-Real-IP']
        };

        Object.assign(req, { files, fields });

        const authorizationHeader = req?.headers['authorization'];

        const queryParams = req?.query ?? {};
        const bodyParams = req?.body ?? {};
        const fieldParams = req?.fields ?? {};
        const fileParams = req?.files ?? {};

        const token = authorizationHeader?.split(' ')?.[1] ?? queryParams.Token ?? bodyParams.Token ?? fieldParams.Token ?? undefined;

        req['RequestID'] = uuidv4();
        req.IncomingParams = {
            ...queryParams,
            ...bodyParams,
            ...fieldParams,
            ...fileParams,
            Token: token,
            UserAgentInformation: userAgentInformation
        };
        const forLogs = { ...req?.IncomingParams };
        if (req.IncomingParams.Password) {
            req.IncomingParams.Password = req?.IncomingParams.Password.replace(/[\s\0\x0B\xc2\xa0]/g, "");
            forLogs.Password = '***************';
        }

        if (req.IncomingParams.NewPassword) {
            req.IncomingParams.NewPassword = req?.IncomingParams.NewPassword.replace(/[\s\0\x0B\xc2\xa0]/g, "");
            forLogs.NewPassword = '***************';
        }

        if (req.IncomingParams.OldPassword) {
            req.IncomingParams.OldPassword = req?.IncomingParams.OldPassword.replace(/[\s\0\x0B\xc2\xa0]/g, "");
            forLogs.OldPassword = '***************';
        }

        logger.info(`Request with ID ${req?.RequestID} started`);
        logger.info(forLogs);
        next();
    });
}