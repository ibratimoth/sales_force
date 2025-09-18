const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SubscriptionPlan = sequelize.define('subscription_plans', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Basic'
    },
    base_price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 50000
    },
    max_base_agents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5
    },
    price_per_extra_agent_6_15: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 8000
    },
    price_per_extra_agent_16_plus: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 7000
    }
}, {
    tableName: 'subscription_plans',
    timestamps: true
});

module.exports = SubscriptionPlan;
