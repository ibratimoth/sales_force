const { DataTypes } = require('sequelize');
const {sequelize} =  require('../config/db');

const Department = sequelize.define('departments1', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: DataTypes.STRING,
    label: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    tableName: 'departments1',
    timestamps: true
});

module.exports = Department