const UserServices = require('../services/userServices');

class UserController {

    constructor() {
        this.userServices = new UserServices();
    }

    async getAllUsers(req, res) {
        try {
            const results = await this.userServices.getAllUsers();

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

    async getUserById(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'UserId is missing'
                })
            }

            const results = await this.userServices.getUserById(userId);

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

    async createUser(req, res) {
        try {

            const { first_name, last_name, email, password, dep_id, role_id } = req.body;

            if (!first_name || !last_name || !email || !password || !dep_id || !role_id) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'UserId is missing'
                })
            }

            const userData = {
                first_name,
                last_name,
                email,
                dep_id,
                password,
                role_id
            }

            const results = await this.userServices.createUser(userData);

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

    async loginUser(req, res) {
        try {

            const {  email, password } = req.body;

            if ( !email || !password ) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'some fields are missing'
                })
            }

            const userData = {
                email,
                password
            }

            const results = await this.userServices.loginUser(userData, res, req);

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

            req.session.role_id = results.data.role_id;

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

    async UpdateUser(req, res) {
        try {

            const { first_name, last_name, email, password, dep_id, role_id } = req.body;
            
            const { userId } = req.params;

            if (!userId || !first_name || !last_name || !email || !dep_id || !role_id) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'UserId is missing'
                })
            }

            const userData = {
                first_name,
                last_name,
                email,
                dep_id,
                password,
                role_id
            }

            const results = await this.userServices.updateUser(userId, userData);

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

    async deleteUser(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'UserId is missing'
                })
            }

            const results = await this.userServices.deleteUser(userId);

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

module.exports = UserController;