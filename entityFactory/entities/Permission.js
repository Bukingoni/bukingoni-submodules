const { Sequelize, DataTypes } = require("sequelize");

class Permission extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        PermissionID: {
          type: DataTypes.BIGINT.UNSIGNED,
          field: "PermissionID",
          primaryKey: true,
          unique: true,
          validate: { min: 1 },
          allowNull: false,
          autoIncrement: true,
        },
        Key: {
          type: DataTypes.STRING(255),
          field: "Key",
          unique: false,
          allowNull: false,
        },
        Name: {
          type: DataTypes.STRING(255),
          field: "Name",
          allowNull: false,
        },
        Deleted: {
          type: DataTypes.BOOLEAN,
          field: "Deleted",
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "Permission",
        tableName: "Permission",
        sequelize,
      }
    );
  }

  static associate(models) {
    const { Role, RolePermission } = models;

    this.belongsToMany(Role, {
      as: "Roles",
      through: RolePermission,
      foreignKey: "PermissionID",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  }
}

module.exports = Permission;
