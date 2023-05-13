const { Sequelize, DataTypes } = require('sequelize');

class Accommodation extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        AccommodationID: {
          type: DataTypes.BIGINT.UNSIGNED,
          field: 'AccommodationID',
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
        modelName: 'Accommodation',
        tableName: 'Accommodation',
        sequelize,
      }
    );
  }
}

module.exports = Accommodation;
