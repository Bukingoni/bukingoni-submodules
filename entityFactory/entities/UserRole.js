const Sequelize = require('sequelize');

class UserRole extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({},
            {
                modelName: 'UserRole',
                tableName: 'UserRole',
                sequelize
            }
        );
    }

    static associate(models) {
        const { Role, User } = models;
        this.belongsTo(Role, {
            foreignKey: {
                name: 'RoleID',
                allowNull: false
            }
        });

        this.belongsTo(User, {
            foreignKey: {
                name: 'UserID',
                allowNull: false
            }
        });
    }
}

module.exports = UserRole;