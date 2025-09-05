const { DataTypes } = require('sequelize');
const {sequelize} =  require('../config/db');

const Permission = sequelize.define('permission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: DataTypes.STRING,
    label: DataTypes.STRING,
    group: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    tableName: 'permission',
    timestamps: true
});

module.exports = Permission