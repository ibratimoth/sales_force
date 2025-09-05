const { DataTypes } = require('sequelize');
const {sequelize} =  require('../config/db');

const Role = sequelize.define('role', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    tableName: 'role',
    timestamps: true
});

module.exports = Role