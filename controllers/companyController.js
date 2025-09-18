const CompanyServices = require('../services/companyService');
const DepartmentServices = require('../services/departmentServices');
const AuthServices = require('../services/authServices');
const UserServices = require('../services/userServices');

class CompanyController {
    constructor() {
        this.companyServices = new CompanyServices();
        this.departmentServices = new DepartmentServices();
        this.authServices = new AuthServices();
        this.userServices = new UserServices();
    }

    async getAllCompanies(req, res) {
        try {
            const results = await this.companyServices.getAllCompanies();

            if (!results.success && results.data.length === 0) {
                return res.status(400).json(results);
            }
            if (!results.success) {
                return res.status(500).json(results);
            }

            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async getCompanyById(req, res) {
        try {
            const { companyId } = req.params;
            if (!companyId) {
                return res.status(400).json({ success: false, message: 'companyId is missing' });
            }

            const results = await this.companyServices.getCompanyById(companyId);

            if (!results.success && results.data === null) {
                return res.status(400).json(results);
            }
            if (!results.success) {
                return res.status(500).json(results);
            }

            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async createCompany(req, res) {
        try {
            const { name, first_name, last_name, email, password, dep_id, role_id } = req.body;

            if (!name || !first_name || !last_name || !email || !password) {
                return res.status(400).json({ success: false, message: 'All data are required' });
            }

            const companyData = { name };
            const results = await this.companyServices.createCompany(companyData);
            const departments = await this.departmentServices.getAllDepartments();
            const roles = await this.authServices.getAllRoles();

            const defaultDepartment = departments.data.find(d => d.name === 'default');
            const defaultRole = roles.data.find(r => r.name === 'manager');

            const userData = {
                first_name,
                last_name,
                email,
                dep_id: defaultDepartment.id,
                password,
                role_id: defaultRole.id,
                company_id: results.data.id
            }
            
            const userResults = await this.userServices.createUser(userData);

            if (!userResults.success) return res.status(400).json(results);

            const combinedResponse = {
                success: true,
                message: "Company, default department, role, and user created successfully",
                company: results.data,
                defaultDepartment,
                defaultRole,
                user: userResults.data
            };

            return res.status(201).json(combinedResponse);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async updateCompany(req, res) {
        try {
            const { companyId } = req.params;
            const { name } = req.body;

            if (!companyId || !name) {
                return res.status(400).json({ success: false, message: 'companyId, name, email are required' });
            }

            const companyData = { name };
            const results = await this.companyServices.updateCompany(companyId, companyData);

            if (!results.success) return res.status(400).json(results);
            return res.status(200).json(results);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async deleteCompany(req, res) {
        try {
            const { companyId } = req.params;
            if (!companyId) {
                return res.status(400).json({ success: false, message: 'companyId is missing' });
            }

            const results = await this.companyServices.deleteCompany(companyId);

            if (!results.success) return res.status(400).json(results);
            return res.status(200).json(results);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }
}

module.exports = CompanyController;
