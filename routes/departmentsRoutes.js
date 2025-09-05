const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const DepartmentServices = new departmentController();

router.get('/department', DepartmentServices.getAllDepartments.bind(DepartmentServices));
router.post('/department', DepartmentServices.createDepartment.bind(DepartmentServices));
router.get('/department/:departmentId', DepartmentServices.getDepartmentById.bind(DepartmentServices));
router.put('/department/:departmentId', DepartmentServices.UpdateDepartment.bind(DepartmentServices));
router.delete('/department/:departmentId', DepartmentServices.deleteDepartment.bind(DepartmentServices));
module.exports = router;