const AuthServices = require('../services/authServices');

class AuthController {

    constructor() {
        this.authServices = new AuthServices();
    }

    async getAllRoles(req, res) {
        try {
            const results = await this.authServices.getAllRoles();

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

    async getAllPermissions(req, res) {
        try {
            const results = await this.authServices.getAllPermissions();

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

    async getRoleById(req, res) {
        try {
            const { role_id } = req.params;

            if (!role_id) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'role id is missing'
                })
            }

            const results = await this.authServices.getRoleById(role_id);

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

    async getPermissionByRole(req, res) {
        try {
            const { role_id } = req.params;

            if (!role_id) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'role id is missing'
                })
            }

            const results = await this.authServices.getPermissionByRole(role_id);

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

    async createPermission(req, res) {
        try {

            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'all data required'
                })
            }

            const RoleData = {
                name
            };

            const results = await this.authServices.createPermissions(RoleData);

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

    async createRole(req, res) {
        try {

            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'name is missing'
                })
            }

            const RoleData = {
                name
            }

            const results = await this.authServices.createRole(RoleData);

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

    async UpdateRole(req, res) {
        try {

            const { name } = req.body;
            const { role_id } = req.params;

            if (!role_id || !name) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'data is missing'
                })
            }

            const RoleData = {
                name
            }

            const results = await this.authServices.updateRole(role_id, RoleData);

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

    async deleteRole(req, res) {
        try {
            const { role_id } = req.params;

            if (!role_id) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'role id is missing'
                })
            }

            const results = await this.authServices.deleteRole(role_id);

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

    async assignPermissions(req, res) {
        try {

            const { permission_ids } = req.body;
            const { role_id } = req.params;

            console.log('permissions_id:', permission_ids);

            if (!role_id || !permission_ids) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'data is missing'
                })
            }

            const results = await this.authServices.assignPermission(role_id, permission_ids);

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

module.exports = AuthController;