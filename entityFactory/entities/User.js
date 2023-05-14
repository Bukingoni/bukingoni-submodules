const { Sequelize, DataTypes } = require("sequelize");

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        UserID: {
          type: DataTypes.BIGINT.UNSIGNED,
          field: "UserID",
          primaryKey: true,
          unique: true,
          validate: { min: 1 },
          allowNull: false,
          autoIncrement: false,
          defaultValue: Sequelize.literal("(UUID_SHORT())"),
        },
        FirstName: {
          type: DataTypes.STRING(50),
          field: "FirstName",
          allowNull: false,
        },
      },
      {
        modelName: "User",
        tableName: "User",
        sequelize,
      }
    );
  }

  static associate(models) {
    const { Role, UserRole } = models;

    this.belongsToMany(Role, {
      as: "Roles",
      through: UserRole,
      foreignKey: "UserID",
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

module.exports = User;
