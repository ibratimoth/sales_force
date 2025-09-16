const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Company = require('./companyModel');
const SubscriptionPlan = require('./subscriptionPlanModel');

const Subscription = sequelize.define('subscriptions', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'companies', key: 'id' }
    },
    plan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'subscription_plans', key: 'id' }
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
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    tableName: 'subscriptions',
    timestamps: true
});

module.exports = Subscription;
