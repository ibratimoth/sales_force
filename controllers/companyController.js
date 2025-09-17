const CompanyServices = require('../services/companyService');

class CompanyController {
    constructor() {
        this.companyServices = new CompanyServices();
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
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({ success: false, message: 'name and email are required' });
            }

            const companyData = { name, email };
            const results = await this.companyServices.createCompany(companyData);

            if (!results.success) return res.status(400).json(results);
            return res.status(201).json(results);

        } catch (error) {
            return res.status(500).json({ success: false, message: 'error occurred', data: error });
        }
    }

    async updateCompany(req, res) {
        try {
            const { companyId } = req.params;
            const { name, email } = req.body;

            if (!companyId || !name || !email) {
                return res.status(400).json({ success: false, message: 'companyId, name, email are required' });
            }

            const companyData = { name, email };
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
