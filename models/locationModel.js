const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Location = sequelize.define('location', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    agent_id: DataTypes.UUID,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE,
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    tableName: 'location',
    timestamps: true
});

module.exports = Location