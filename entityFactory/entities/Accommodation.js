const { Sequelize, DataTypes } = require("sequelize");

class Accommodation extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        AccommodationID: {
          type: DataTypes.BIGINT.UNSIGNED,
          field: "AccommodationID",
          primaryKey: true,
          unique: true,
          validate: { min: 1 },
          allowNull: false,
          autoIncrement: false,
          defaultValue: Sequelize.fn("UUID_SHORT"),
        },
        Name: {
          type: DataTypes.STRING(50),
          field: "Name",
          unique: "True",
          allowNull: false,
        },
        Benefits: {
          type: DataTypes.STRING(255),
          field: "Benefits",
          allowNull: true,
          defaultValue: "",
        },
        MinNumberOfGuests: {
          type: DataTypes.BIGINT.UNSIGNED,
          field: "MinNumberOfGuests",
          allowNull: false,
          validate: { min: 1 },
          defaultValue: 1,
        },
        MaxNumberOfGuests: {
          type: DataTypes.BIGINT.UNSIGNED,
          field: "MaxNumberOfGuests",
          allowNull: false,
          validate: { min: 1 },
          defaultValue: 1,
        },
        Address: {
          type: DataTypes.STRING(255),
          field: "Address",
          allowNull: false,
          defaultValue: "",
        },
        Lat: {
          type: DataTypes.FLOAT,
          field: "Lat",
          allowNull: true,
        },
        Lng: {
          type: DataTypes.FLOAT,
          field: "Lng",
          allowNull: true,
        },
        LastModifiedAt: {
          type: DataTypes.DATE,
          field: "LastModifiedAt",
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
        Deleted: {
          type: DataTypes.BOOLEAN,
          field: "Deleted",
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "Accommodation",
        tableName: "Accommodation",
        sequelize,
      }
    );
  }

  static associate(models) {
    const { User, Attachment, AccommodationAttachment } = models;

    this.belongsTo(User, {
      foreignKey: {
        name: "OwnerID",
        allowNull: false,
      },
    });

    this.belongsToMany(Attachment, {
      as: "Attachments",
      through: AccommodationAttachment,
      foreignKey: "AccommodationID",
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  }
}

module.exports = Accommodation;
