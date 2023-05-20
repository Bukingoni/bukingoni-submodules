const Sequelize = require("sequelize");

class AccommodationAttachment extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {},
            {
                modelName: "AccommodationAttachment",
                tableName: "AccommodationAttachment",
                sequelize,
            }
        );
    }

    static associate(models) {
        const { Accommodation, Attachment } = models;

        this.belongsTo(Accommodation, {
            foreignKey: {
                name: "AccommodationID",
                allowNull: false,
            }
        });

        this.belongsTo(Attachment, {
            foreignKey: {
                name: "AttachmentID",
                allowNull: false
            }
        });
    }
}