const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AgentNote = sequelize.define(
    'agent_note',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        agent_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        lat: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: false,
        },
        lng: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: false,
        },
        location_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        activity_done: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'agent_note',
        timestamps: true,
    }
);

module.exports = AgentNote;
