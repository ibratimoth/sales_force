const AuthRepository = require('../repositories/authRepositories');

class AuthServices {
    constructor() {
        this.authRepository = new AuthRepository();
    }

    async assignPermission(role_id, permission_ids) {

        try {
            const result = await this.authRepository.assignPermissions(role_id, permission_ids);

            if (result.added_permissions.length > 0) {
                return { success: true, message: 'Permissions added successfully', data: result };
            }

            return { success: true, message: 'Permissions already added', data: result };
        } catch (error) {
            console.log('error while assigning role:', error);
            return { success: false, message: 'error while assigning', data: error };
        }
    }

    async createPermissions(permissionData) {

        try {
            const result = await this.authRepository.createPermissions(permissionData);

            if (result) {
                return { success: true, message: 'Permissions created successfully', data: result };
            }

            return { success: false, message: 'Permissions did not created', data: null };
        } catch (error) {
            console.log('error while creating Permissions:', error);
            return { success: false, message: 'error while creating Permissions', data: error };
        }
    };
    
    async createRole(role_data) {

        try {
            const result = await this.authRepository.createRole(role_data);

            if (result) {
                return { success: true, message: 'Role created successfully', data: result };
            }

            return { success: false, message: 'Role did not created', data: null };
        } catch (error) {
            console.log('error while creating role:', error);
            return { success: false, message: 'error while creating role', data: error };
        }
    };

    async updateRole(role_id, role_data) {

        try {
            const result = await this.authRepository.updateRole(role_id, role_data);

            if (result) {
                return { success: true, message: 'Role updated successfully', data: result };
            }

            return { success: false, message: 'Role did not updated', data: null };
        } catch (error) {
            console.log('error while updating role:', error);
            return { success: false, message: 'error while updating role', data: error };
        }
    };

    async getAllRoles() {

        try {
            const result = await this.authRepository.getAllRole();

            if (result.length > 0) {
                return { success: true, message: 'Data retrieved successfully', data: result };
            }

            return { success: false, message: 'no role registered yet', data: [] };
        } catch (error) {
            console.log('error while retrieving role:', error);
            return { success: false, message: 'error while retrieving role', data: error };
        }
    };

    async getAllPermissions() {

        try {
            const result = await this.authRepository.getAllPermissions();

            if (result.length > 0) {
                return { success: true, message: 'Data retrieved successfully', data: result };
            }

            return { success: false, message: 'no permission registered yet', data: [] };
        } catch (error) {
            console.log('error while retrieving permission:', error);
            return { success: false, message: 'error while retrieving permission', data: error };
        }
    };

    async getRoleById(role_id) {

        try {
            const result = await this.authRepository.getRoleById(role_id);

            if (result) {
                return { success: true, message: 'Data retrieved successfully', data: result };
            }

            return { success: false, message: 'fail to retrieve data', data: null };
        } catch (error) {
            console.log('error while retrieving role:', error);
            return { success: false, message: 'error while retrieving role', data: error };
        }
    };

    async getPermissionByRole(role_id) {

        try {
            const result = await this.authRepository.getPermissionByRole(role_id);

            if (result.length > 0) {
                return { success: true, message: 'Data retrieved successfully', data: result };
            }

            return { success: false, message: 'fail to retrieve data', data: [] };
        } catch (error) {
            console.log('error while retrieving role:', error);
            return { success: false, message: 'error while retrieving role', data: error };
        }
    };

    async deleteRole(role_id) {

        try {
            const result = await this.authRepository.deleteRole(role_id);

            if (result) {
                return { success: true, message: 'Data delete successfully', data: result };
            }

            return { success: false, message: 'fail to delete data', data: null };
        } catch (error) {
            console.log('error while deleting role:', error);
            return { success: false, message: 'error while deleting role', data: error };
        }
    };

}

module.exports = AuthServices;