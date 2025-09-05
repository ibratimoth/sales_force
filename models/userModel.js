const { DataTypes } = require('sequelize');
const {sequelize} =  require('../config/db');

const User = sequelize.define('user2', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    dep_id: DataTypes.UUID,
    role_id: DataTypes.UUID,
    password: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    tableName: 'user2',
    timestamps: true
});

module.exports = User