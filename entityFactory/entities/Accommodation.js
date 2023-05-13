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
        Name: {
            type: DataTypes.STRING(50),
            field: 'Name',
            allowNull: false,
        },
        Benefits: {
            type: DataTypes.STRING(255),
            field: 'Benefits',
            allowNull: true,
            defaultValue: '',
        },
        MinNumberOfGuests: {
            type: DataTypes.BIGINT.UNSIGNED,
            field: 'MinNumberOfGuests',
            allowNull: false,
            validate: { min: 1 },
            defaultValue: 1,
        },
        MaxNumberOfGuests: {
            type: DataTypes.BIGINT.UNSIGNED,
            field: 'MaxNumberOfGuests',
            allowNull: false,
            validate: { min: 1 },
            defaultValue: 1,
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
