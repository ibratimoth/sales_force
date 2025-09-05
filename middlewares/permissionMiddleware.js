const Permission = require('../models/permissionModel');
const RolePermission = require('../models/rolePermisionModel');

function rbac(requiredPermissions) {
    return async (req, res, next) => {
        try {
            const role_id = req.session.role_id;

            if (!role_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Role Id required'
                })
            };

            const role_permissions = await RolePermission.findAll({
                where: { role_id }, include: [
                    {
                        model: Permission,
                        attributes: ['name']
                    }
                ]
            });

            const permission = role_permissions.map(p => p.Permission.name);

            if (permission.includes(requiredPermissions)) {
                return next()
            }

            return res.status(403).json({ success: false, message: 'Access denied: Missing permission' });
        } catch (error) {
            console.error('RBAC error:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}