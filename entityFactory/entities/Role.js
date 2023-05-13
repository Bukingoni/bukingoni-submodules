const { Sequelize, DataTypes } = require('sequelize');

class Role extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                RoleID: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    field: 'RoleID',
                    primaryKey: true,
                    unique: true,
                    validate: { min: 1 },
                    allowNull: false,
                    autoIncrement: false,
                    defaultValue: Sequelize.fn('UUID_SHORT')
                },
                Name: {
                    type: DataTypes.STRING(255),
                    field: 'Name',
                    allowNull: false
                },
                Public: {
                    type: DataTypes.BOOLEAN,
                    field: 'Public',
                    allowNull: false,
                    default: true
                },
                Deleted: {
                    type: DataTypes.BOOLEAN,
                    field: 'Deleted',
                    allowNull: false,
                    defaultValue: false
                },
            },
            {
                modelName: 'Role',
                tableName: 'Role',
                sequelize
            }
        );
    }

    static associate(models) {
        const { User, Permission, RolePermission, UserRole } = models;

        this.belongsToMany(Permission, {
            as: 'Permissions',
            through: RolePermission,
            foreignKey: 'RoleID',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });

        this.belongsToMany(User, {
            as: 'Users',
            through: UserRole,
            foreignKey: 'RoleID',
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    }
}

module.exports = Role;