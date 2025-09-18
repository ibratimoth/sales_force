const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Subscription = sequelize.define('subscriptions', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    plan_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    agent_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    total_price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 50000
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    }
}, {
    tableName: 'subscriptions',
    timestamps: true
});

module.exports = Subscription;
