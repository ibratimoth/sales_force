const { DataTypes } = require('sequelize');
const {sequelize} =  require('../config/db');

const RolePermission = sequelize.define('role_permission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    role_id: DataTypes.STRING,
    permission_id: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    tableName: 'role_permission',
    timestamps: true
});

module.exports = RolePermission