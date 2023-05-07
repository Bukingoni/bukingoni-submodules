const services = require('../services');

module.exports.findPermissions = async UserID => {
    const userParams = {
        where: {
            UserID,
            Deleted: false
        },
        include: [
            {
                EntityName: 'Role',
                as: 'Roles',
                required: false,
                include: [
                    {
                        EntityName: 'Permission',
                        as: 'Permissions',
                        required: false
                    }
                ]
            }
        ]
    };

    const user = await services.findOne(userParams, 'User');
    if (!user?.Roles?.length) {
        return null;
    }
    let joinedPermissions = new Set();

    for (const role of user.Roles) {
        for (const permission of role.Permissions) {
            joinedPermissions.add(permission.Key);
        }
    }

    return arrayToObject(Array.from(joinedPermissions));
};

module.exports.hasPermission = (operation, permissions, strictMode = true) => {
    if (!permissions) {
        return false;
    }
    if (operation instanceof Array) {
        return strictMode ?
            operation.every(op => this.hasPermission(op, permissions)) :
            operation.some(op => this.hasPermission(op, permissions));
    }
    return permissions[operation] === true;
};


module.exports.filterPermissions = async permissions => {
    const allPermissions = (await getAllPermissions()).map(permission => permission.PermissionID);
    return permissions.filter(permission => allPermissions.includes(permission));
};


const getAllPermissions = async () => {
    return await services.findAll({ where: { Deleted: false } }, "Permission");
};

const arrayToObject = array => Object.fromEntries(array.map(element => [element, true]));