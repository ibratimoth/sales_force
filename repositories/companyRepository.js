const Company = require('../models/companyModel');

class CompanyRepository {
    async getAllCompanies() {
        return await Company.findAll({ order: [['createdAt', 'DESC']] });
    }

    async getCompanyById(id) {
        return await Company.findByPk(id);
    }

    async createCompany(companyData) {
        return await Company.create(companyData);
    }

    async updateCompany(companyId, companyData) {
        const company = await Company.findByPk(companyId);
        if (!company) throw new Error("Company not found");

        await company.update(companyData);
        return company;
    }

    async deleteCompany(companyId) {
        const company = await Company.findByPk(companyId);
        if (!company) throw new Error("Company not found");

        return await Company.destroy({ where: { id: companyId } });
    }
}

module.exports = CompanyRepository;
