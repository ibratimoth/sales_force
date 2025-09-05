const Department = require('../models/departmentModel');

class DepartmentRepositories {

    async getAllDepartments() {
        return await Department.findAll({ order: [['createdAt', 'DESC']] })
    }

    async getDepartmentById(id) {
        return await Department.findByPk(id);
    }

    async createDepartment(DepartmentData) {
        return await Department.create(DepartmentData);
    }

    async updateDepartment(DepartmentId, DepartmentData) {
        const department = await Department.findByPk(DepartmentId);

        if (!department) {
            throw new Error("Department not found");
        }

        await department.update(DepartmentData);
        return department;
    }

    async deleteDepartment(DepartmentId) {
        const department = await Department.findByPk(DepartmentId);

        if (!department) {
            throw new Error("Department not found");
        }

        return await Department.destroy({where: {id: DepartmentId}})
    }
}

module.exports = DepartmentRepositories;