const logger = require("./logger");
const { API_ERROR } = require("../constants");

module.exports = (req, res) => {
  const apiResult = res.OutgoingParams;

  const status = apiResult?.status ?? 404;
  const responseJson = {
    key: apiResult?.key ?? API_ERROR.ROUTE_NOT_FOUND,
    message: apiResult?.message ?? "Route not found.",
    result: apiResult?.result ?? {},
  };
  logger.info(
    `Request with ID ${req?.RequestID} finished with status: ${status}`
  );
  logger.info(responseJson);
  return res.status(status).send(responseJson);
};
