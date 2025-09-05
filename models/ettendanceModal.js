const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('attendance', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    agent_id: { type: DataTypes.UUID, allowNull: false },
    checkin_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    checkout_time: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'attendance', timestamps: true });

module.exports = Attendance;
