const Sequelize = require("sequelize");

class RolePermission extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {},
      {
        modelName: "RolePermission",
        tableName: "RolePermission",
        sequelize,
      }
    );
  }

  static associate(models) {
    const { Role, Permission } = models;

    this.belongsTo(Role, {
      foreignKey: {
        name: "RoleID",
        allowNull: false,
      },
    });

    this.belongsTo(Permission, {
      foreignKey: {
        name: "PermissionID",
        allowNull: false,
      },
    });
  }
}

module.exports = RolePermission;
