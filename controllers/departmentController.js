const DepartmentServices = require('../services/departmentServices');

class departmentController {

    constructor() {
        this.departmentServices = new DepartmentServices();
    }

    async getAllDepartments(req, res) {
        try {
            const results = await this.departmentServices.getAllDepartments();

            if (!results.success && results.data.length === 0) {
                return res.status(400).json({
                    status: 400,
                    success: results.success,
                    message: results.message,
                    data: results.data
                })
            }

            if (!results.success) {
                return res.status(500).json({
                    status: 500,
                    success: results.success,
                    message: results.message,
                    data: results.error
                })
            }

            return res.status(200).json({
                status: 200,
                success: results.success,
                message: results.message,
                data: results.data
            })

        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "error occured",
                data: error
            })
        }
    }

    async getDepartmentById(req, res) {
        try {
            const { DepartmentId } = req.params;

            if (!DepartmentId) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'DepartmentId is missing'
                })
            }

            const results = await this.departmentServices.getDepartmentById(DepartmentId);

            if (!results.success && results.data === null) {
                return res.status(400).json({
                    status: 400,
                    success: results.success,
                    message: results.message,
                    data: results.data
                })
            }

            if (!results.success) {
                return res.status(500).json({
                    status: 500,
                    success: results.success,
                    message: results.message,
                    data: results.error
                })
            }

            return res.status(200).json({
                status: 200,
                success: results.success,
                message: results.message,
                data: results.data
            })

        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "error occured",
                data: error
            })
        }
    }

    async createDepartment(req, res) {
        try {

            const { name, label } = req.body;

            if (!name || !label) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'DepartmentId is missing'
                })
            }

            const DepartmentData = {
                name,
                label
            }

            const results = await this.departmentServices.createDepartment(DepartmentData);

            if (!results.success && results.data === null) {
                return res.status(400).json({
                    status: 400,
                    success: results.success,
                    message: results.message,
                    data: results.data
                })
            }

            if (!results.success) {
                return res.status(500).json({
                    status: 500,
                    success: results.success,
                    message: results.message,
                    data: results.error
                })
            }

            return res.status(200).json({
                status: 200,
                success: results.success,
                message: results.message,
                data: results.data
            })

        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "error occured",
                data: error
            })
        }
    }

    async UpdateDepartment(req, res) {
        try {

            const { name, label } = req.body;
            const { DepartmentId } = req.params;

            if (!DepartmentId || !name || !label) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'DepartmentId is missing'
                })
            }

            const DepartmentData = {
                name,
                label
            }

            const results = await this.departmentServices.updateDepartment(DepartmentId, DepartmentData);

            if (!results.success && results.data === null) {
                return res.status(400).json({
                    status: 400,
                    success: results.success,
                    message: results.message,
                    data: results.data
                })
            }

            if (!results.success) {
                return res.status(500).json({
                    status: 500,
                    success: results.success,
                    message: results.message,
                    data: results.error
                })
            }

            return res.status(200).json({
                status: 200,
                success: results.success,
                message: results.message,
                data: results.data
            })

        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "error occured",
                data: error
            })
        }
    }

    async deleteDepartment(req, res) {
        try {
            const { DepartmentId } = req.params;

            if (!DepartmentId) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'DepartmentId is missing'
                })
            }

            const results = await this.departmentServices.deleteDepartment(DepartmentId);

            if (!results.success && results.data === null) {
                return res.status(400).json({
                    status: 400,
                    success: results.success,
                    message: results.message,
                    data: results.data
                })
            }

            if (!results.success) {
                return res.status(500).json({
                    status: 500,
                    success: results.success,
                    message: results.message,
                    data: results.error
                })
            }

            return res.status(200).json({
                status: 200,
                success: results.success,
                message: results.message,
                data: results.data
            })

        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "error occured",
                data: error
            })
        }
    }
}

module.exports = departmentController;