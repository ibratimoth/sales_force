const userRelation = require('../models/userModel');
const departmentRelation = require('../models/departmentModel');
const roleRelation = require('../models/roleModel');
const permissionRelation = require('../models/permissionModel');
const rolePermissionRelation = require('../models/rolePermisionModel');
const locationRelation = require('../models/locationModel');
const attendanceRelation = require('../models/ettendanceModal');
const agentnoteRelation = require('../models/agentNoteModel');
const companyRelation = require('../models/companyModel'); 
const subscriptionPlanRelation = require('../models/subscriptionPlanModel'); 
const subscriptionRelation = require('../models/subscriptionModel');

// ----------------- User, Department, Role, Permission Relations -----------------
departmentRelation.hasMany(userRelation, { foreignKey: 'dep_id' });
userRelation.belongsTo(departmentRelation, { foreignKey: 'dep_id' });

companyRelation.hasMany(departmentRelation, {foreignKey: 'company_id'});
departmentRelation.belongsTo(companyRelation, {foreignKey: 'company_id'});

companyRelation.hasMany(userRelation, {foreignKey: 'company_id'});
userRelation.belongsTo(companyRelation, {foreignKey: 'company_id'});

roleRelation.hasMany(rolePermissionRelation, {foreignKey: 'role_id'});
rolePermissionRelation.belongsTo(roleRelation, {foreignKey: 'role_id'});

permissionRelation.hasMany(rolePermissionRelation, {foreignKey: 'permission_id'});
rolePermissionRelation.belongsTo(permissionRelation, {foreignKey: 'permission_id'});

roleRelation.hasMany(userRelation, {foreignKey: 'role_id'});
userRelation.belongsTo(roleRelation, {foreignKey: 'role_id'});

userRelation.hasMany(locationRelation, {foreignKey: 'agent_id'});
locationRelation.belongsTo(userRelation, {foreignKey: 'agent_id'});

userRelation.hasMany(attendanceRelation, {foreignKey: 'agent_id'});
attendanceRelation.belongsTo(userRelation, {foreignKey: 'agent_id'});

userRelation.hasMany(agentnoteRelation, {foreignKey: 'agent_id'});
agentnoteRelation.belongsTo(userRelation, {foreignKey: 'agent_id'});

// ----------------- Subscription Relations -----------------
companyRelation.hasMany(subscriptionRelation, { foreignKey: 'company_id' });
subscriptionRelation.belongsTo(companyRelation, { foreignKey: 'company_id' });

subscriptionPlanRelation.hasMany(subscriptionRelation, { foreignKey: 'plan_id' });
subscriptionRelation.belongsTo(subscriptionPlanRelation, { foreignKey: 'plan_id' });

// Total price calculation function
subscriptionRelation.calculateTotalPrice = function(plan, agentCount) {
    let total = parseFloat(plan.base_price);

    if (agentCount > plan.max_base_agents) {
        const extraAgents = agentCount - plan.max_base_agents;

        const agents6to15 = Math.min(extraAgents, 10);
        total += agents6to15 * parseFloat(plan.price_per_extra_agent_6_15);

        const agents16plus = Math.max(extraAgents - 10, 0);
        total += agents16plus * parseFloat(plan.price_per_extra_agent_16_plus);
    }

    return total;
};

// ----------------- Export All Relations -----------------
module.exports = {
    departmentRelation,
    userRelation,
    roleRelation,
    permissionRelation,
    rolePermissionRelation,
    attendanceRelation,
    locationRelation,
    agentnoteRelation,
    companyRelation,
    subscriptionRelation,
    subscriptionPlanRelation
};
