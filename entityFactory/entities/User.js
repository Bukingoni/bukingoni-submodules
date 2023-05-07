const { Sequelize, DataTypes } = require('sequelize');

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        UserID: {
          type: DataTypes.BIGINT.UNSIGNED,
          field: 'UserID',
          primaryKey: true,
          unique: true,
          validate: { min: 1 },
          allowNull: false,
          autoIncrement: false,
          defaultValue: Sequelize.fn('UUID_SHORT'),
        },
        FirstName: {
            type: DataTypes.STRING(50),
            field: 'FirstName',
            allowNull: false,
        }
      },
      {
        modelName: 'User',
        tableName: 'User',
        sequelize,
      }
    );
  }
}

module.exports = User;
