const { sequelize } = require('../config/db');
const Role = require('../models/roleModel');
const Permission = require('../models/permissionModel');
const RolePermission = require('../models/rolePermisionModel');

class authRepository {

    async getAllRole() {
        return await Role.findAll({ order: [['createdAt', 'DESC']],
            include: [
                {
                    model: RolePermission,
                    include:[{
                        model: Permission,
                        attributes: ['label']
                    }]
                }
            ]
         })
    };

    async getRoleById(id) {
        return await Role.findByPk(id);
    };

    async createRole(role_data) {
        return await Role.create(role_data);
    };

    async updateRole(role_id, role_data) {
        const role = await Role.findByPk(role_id);

        if (!role) {
            throw new Error("role not found");
        }

        await role.update(role_data);
        return role;
    };

    async deleteRole(role_id) {
        const role = await Role.findByPk(role_id);

        if (!role) {
            throw new Error("role not found");
        }

        return await Role.destroy({ where: { id: role_id } });
    };

    async createPermissions(baseData) {
        const actions = ["list", "view", "create", "update", "delete"];

        const permissions_to_insert = actions.map(a => ({
            name: `${a}_${baseData.name}`,
            label: `${a} ${baseData.name}`,
            group: baseData.name
        }));

        return await Permission.bulkCreate(permissions_to_insert);
    };

    async assignPermissions(role_id, permission_ids) {
        const transaction = await sequelize.transaction();

        try {

            const existing = await RolePermission.findAll({
                where: { role_id, permission_id: permission_ids },
                transaction
            });

            const existing_permission_ids = new Set(existing.map(p => p.permission_id));

            const new_permission_links = [];
            const skipped_permission_ids = [];

            for (const permission_id of permission_ids) {
                if (!existing_permission_ids.has(permission_id)) {
                    new_permission_links.push({ role_id, permission_id })
                } else {
                    skipped_permission_ids.push(permission_id);
                }
            }

            if (new_permission_links.length > 0) {
                await RolePermission.bulkCreate(new_permission_links, { transaction });
            }

            const all_existing = await RolePermission.findAll({
                where: {
                    role_id
                },
                transaction
            });

            const new_permission_set = new Set(permission_ids);

            const permission_to_remove = all_existing.filter(p => !new_permission_set.has(p.permission_id));

            if (permission_to_remove.length > 0) {
                const removed_ids = permission_to_remove.map(p => p.id);
                await RolePermission.destroy({
                    where: { id: removed_ids },
                    transaction
                })

                console.log(`[Audit] Removed permissions from ${role_id}:`, permission_to_remove.map(p => p.permission_id));
            }

            if (skipped_permission_ids.length > 0) {
                console.log(`[Audit] Skipped permission for role ${role_id}:`, skipped_permission_ids);
            }

            await transaction.commit();

            return {
                role_id,
                added_permissions: new_permission_links.map(p => p.permission_id),
                skipped_permissions: skipped_permission_ids,
                removed_permissions: permission_to_remove.map(p => p.permission_id)
            }
        } catch (error) {
            await transaction.rollback();
            console.error(`[Error] Failed to assign permission to role ${role_id}:`, error);
            throw error;
        }
    };

    async getPermissionByRole(role_id) {
        return await RolePermission.findAll({ where: { role_id }, include: [
            {
                model: Permission,
                attributes: ['name']
            },
            {
                model: Role,
                attributes: ['name']
            }
        ] });
    };

    async getAllPermissions() {
        return await Permission.findAll({ order: [['createdAt', 'DESC']] })
    };
}

module.exports = authRepository;
