const userRelation = require('../models/userModel');
const departmentRelation = require('../models/departmentModel');
const roleRelation = require('../models/roleModel');
const permissionRelation = require('../models/permissionModel');
const rolePermissionRelation = require('../models/rolePermisionModel');
const locationRelation = require('../models/locationModel');
const attendanceRelation = require('../models/ettendanceModal');

departmentRelation.hasMany(userRelation, { foreignKey: 'dep_id' });
userRelation.belongsTo(departmentRelation, { foreignKey: 'dep_id' });

roleRelation.hasMany(rolePermissionRelation, {foreignKey: 'role_id'});
rolePermissionRelation.belongsTo(roleRelation, {foreignKey: 'role_id'})

permissionRelation.hasMany(rolePermissionRelation, {foreignKey: 'permission_id'});
rolePermissionRelation.belongsTo(permissionRelation, {foreignKey: 'permission_id'});

roleRelation.hasMany(userRelation, {foreignKey: 'role_id'});
userRelation.belongsTo(roleRelation, {foreignKey: 'role_id'});

userRelation.hasMany(locationRelation, {foreignKey: 'agent_id'});
locationRelation.belongsTo(userRelation, {foreignKey: 'agent_id'});

userRelation.hasMany(attendanceRelation, {foreignKey: 'agent_id'});
attendanceRelation.belongsTo(userRelation, {foreignKey: 'agent_id'});


module.exports = {
    departmentRelation,
    userRelation,
    roleRelation,
    permissionRelation,
    rolePermissionRelation,
    attendanceRelation,
    locationRelation
}