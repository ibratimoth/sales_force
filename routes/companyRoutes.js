const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/companyController');
const companyController = new CompanyController();

router.get('/companies', companyController.getAllCompanies.bind(companyController));
router.post('/companies', companyController.createCompany.bind(companyController));
router.get('/companies/:companyId', companyController.getCompanyById.bind(companyController));
router.put('/companies/:companyId', companyController.updateCompany.bind(companyController));
router.delete('/companies/:companyId', companyController.deleteCompany.bind(companyController));

module.exports = router;
