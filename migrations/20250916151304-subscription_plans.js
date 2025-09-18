'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscription_plans', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Basic' // Only one plan
      },
      base_price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 50000
      },
      max_base_agents: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
      },
      price_per_extra_agent_6_15: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 8000
      },
      price_per_extra_agent_16_plus: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 7000
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscription_plans');
  }
};
