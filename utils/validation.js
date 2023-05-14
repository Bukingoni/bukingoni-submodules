const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const services = require("../services");

module.exports.validateObject = (
  properties,
  required,
  params,
  additionalProperties
) => {
  const ajv = new Ajv();
  addFormats(ajv);
  const schema = {
    type: "object",
    properties,
    required,
    additionalProperties,
  };

  const validate = ajv.compile(schema);
  const valid = validate(params);
  if (!valid) {
    return validate.errors;
  }

  return null;
};

module.exports.checkEntityExists = async (
  params = {},
  optional = {},
  include = []
) => {
  const whereParams = {
    [`${params.EntityName}ID`]: params.EntityID,
    ...optional,
  };

  const exists = await services.findOne(
    { where: whereParams, include, raw: false, required: true },
    params.EntityName
  );

  return exists ?? null;
};
