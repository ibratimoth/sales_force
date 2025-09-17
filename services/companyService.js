const CompanyRepository = require('../repositories/companyRepository');

class CompanyServices {
    constructor() {
        this.companyRepository = new CompanyRepository();
    }

    async getAllCompanies() {
        try {
            const results = await this.companyRepository.getAllCompanies();
            if (results.length > 0) {
                return { success: true, message: 'Companies fetched successfully', data: results };
            }
            return { success: false, message: 'No companies found', data: [] };
        } catch (error) {
            console.log('Error while fetching companies:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async getCompanyById(companyId) {
        try {
            const results = await this.companyRepository.getCompanyById(companyId);
            if (results) {
                return { success: true, message: 'Company fetched successfully', data: results };
            }
            return { success: false, message: 'Company not found', data: null };
        } catch (error) {
            console.log('Error while fetching company:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async createCompany(companyData) {
        try {
            const results = await this.companyRepository.createCompany(companyData);
            if (results) {
                return { success: true, message: 'Company created successfully', data: results };
            }
            return { success: false, message: 'Failed to create company', data: null };
        } catch (error) {
            console.log('Error while creating company:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async updateCompany(companyId, companyData) {
        try {
            const results = await this.companyRepository.updateCompany(companyId, companyData);
            if (results) {
                return { success: true, message: 'Company updated successfully', data: results };
            }
            return { success: false, message: 'Failed to update company', data: null };
        } catch (error) {
            console.log('Error while updating company:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }

    async deleteCompany(companyId) {
        try {
            const results = await this.companyRepository.deleteCompany(companyId);
            if (results) {
                return { success: true, message: 'Company deleted successfully', data: results };
            }
            return { success: false, message: 'Failed to delete company', data: null };
        } catch (error) {
            console.log('Error while deleting company:', error);
            return { success: false, message: 'Error occurred', error };
        }
    }
}

module.exports = CompanyServices;
