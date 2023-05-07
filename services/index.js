const EntityFactory = require("../entityFactory");
const CommonUtils = require("../utils/common");

module.exports.create = (createParams, entityName, options = {}) => {
    return EntityFactory.getEntity(entityName).create(createParams, options);
}

module.exports.findOne = (queryParams, entityName, options = {}) => {
    queryParams.include = CommonUtils.recursiveInclude(queryParams.include, EntityFactory);
    return EntityFactory.getEntity(entityName).findOne({ ...queryParams, ...options });
}

module.exports.findAll = (queryParams, entityName, options = {}) => {
    queryParams.include = CommonUtils.recursiveInclude(queryParams.include, EntityFactory);
    return EntityFactory.getEntity(entityName).findAll({ ...queryParams, ...options });
}

module.exports.count = async (queryParams, entityName, options = {}) => {
    queryParams.include = CommonUtils.recursiveInclude(queryParams.include, EntityFactory);
  const result =  await EntityFactory.getEntity(entityName).findAndCountAll({ ...queryParams, ...options, distinct: true });
  return result.count;
}

module.exports.update = (what, where, entityName, options = {}) => {
    return EntityFactory.getEntity(entityName).update(what, { ...where, ...options });
}

module.exports.destroy = (queryParams, entityName, options = {}) => {
    return EntityFactory.getEntity(entityName).destroy({ ...queryParams, ...options });
}

module.exports.getUUID = async () => {
    const result = await EntityFactory.instance.query('SELECT UUID_SHORT() as UUID;');
    return result?.[0]?.[0]?.UUID;
};

module.exports.getEntity = entityName => {
    return EntityFactory.getEntity(entityName);
};

module.exports.getSequelizeInstance = () => {
    return EntityFactory.instance;
};

module.exports.getEntityColumns = async (entity) => {
    const Entity = EntityFactory.getEntity(entity);
    return await Entity.describe();
}