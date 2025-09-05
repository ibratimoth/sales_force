const DepartmentRepository = require('../repositories/departmentRepository');
const HashHelper = require('../helpers/hashHelper');

class DepartmentServices {
    constructor() {
        this.departmentRepository = new DepartmentRepository();
        this.hashHelper = new HashHelper();
    }

    async getAllDepartments() {
        try {
            const results = await this.departmentRepository.getAllDepartments();

            if (results.length > 0) {
                return { success: true, message: 'Departments fetched successfully', data: results };
            }

            return { success: false, message: 'no Department found', data: [] };
        } catch (error) {
            console.log('error occured while fetching Department:', error);
            return { success: false, message: 'error occured', error: error };
        }

    }

    async getDepartmentById(departmentById) {
        try {
            const results = await this.departmentRepository.getDepartmentById(departmentById);

            if (results) {
                return { success: true, message: 'Departments fetched successfully', data: results };
            }

            return { success: false, message: 'no departments found', data: null };
        } catch (error) {
            console.log('error occured while fetching departments:', error);
            return { success: false, message: 'error occured', error: error };
        }

    }

    async createDepartment(departmentData) {
        try {
            
            const results = await this.departmentRepository.createDepartment(departmentData);

            if (results) {
                return { success: true, message: 'Department created successfully', data: results };
            }

            return { success: false, message: 'failed to created', data: null };
        } catch (error) {
            console.log('error occured while creating department:', error);
            return { success: false, message: 'error occured', error: error };
        }
    }

    async updateDepartment(departmentId, departmentData) {
        try {
            const results = await this.departmentRepository.updateDepartment(departmentId, departmentData);

            if (results) {
                return { success: true, message: 'department updated successfully', data: results };
            }

            return { success: false, message: 'failed to update', data: null };
        } catch (error) {
            console.log('error occured while updating user:', error);
            return { success: false, message: 'error occured', error: error };
        }
    }

    async deleteDepartment(departmentId, departmentData) {
        try {
            const results = await this.departmentRepository.deleteDepartment(departmentId, departmentData);

            if (results) {
                return { success: true, message: 'Department deleted successfully', data: results };
            }

            return { success: false, message: 'failed to delete', data: null };
        } catch (error) {
            console.log('error occured while deleting user:', error);
            return { success: false, message: 'error occured', error: error };
        }
    }
};

module.exports = DepartmentServices;