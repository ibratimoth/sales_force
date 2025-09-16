const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const SubscriptionPlan = require('./subscriptionPlanModel');

const SubscriptionPlanFeature = sequelize.define('subscription_plan_features', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    plan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'subscription_plans', key: 'id' }
    },
    feature_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    feature_value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    tableName: 'subscription_plan_features',
    timestamps: true
});

module.exports = SubscriptionPlanFeature;
