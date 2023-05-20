const { Sequelize, DataTypes } = require('sequelize');

class Attachment extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                AttachmentID: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    field: "AttachmentID",
                    primaryKey: true,
                    unique: true,
                    validate: { min: 1 },
                    allowNull: false,
                    autoIncrement: false,
                    defaultValue: Sequelize.fn("UUID_SHORT"),
                },
                OriginalFileName: {
                    type: DataTypes.STRING(255),
                    field: "OriginalFileName",
                    allowNull: true,
                },
                Deleted: {
                    type: DataTypes.BOOLEAN,
                    field: "Deleted",
                    allowNull: false,
                    defaultValue: false,
                },
                CreatedAt: {
                    type: DataTypes.DATE,
                    field: "CreatedAt",
                    allowNull: true,
                    defaultValue: Sequelize.NOW,
                },
            },
            {
                modelName: "Attachment",
                tableName: "Attachment",
                sequelize
            }
        );
    }

    static associate(models) {
        const { Accommodation, AccommodationAttachment } = models;

        this.belongsToMany(Accommodation, {
            as: "Accommodations",
            through: AccommodationAttachment,
            foreignKey: "AttachmentID",
            allowNull: false,
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    }
}

module.exports = Attachment;
