const UserRepository = require('../repositories/userRepository');
const HashHelper = require('../helpers/hashHelper');
const TokenUtil  = require('../utils/generateToken');

class UserServices {
    constructor() {
        this.userRepository = new UserRepository();
        this.hashHelper = new HashHelper();
        this.tokenUtil = new TokenUtil();
    }

    async getAllUsers() {
        try {
            const results = await this.userRepository.getAllUsers();

            if (results.length > 0) {
                return { success: true, message: 'User fetched successfully', data: results };
            }

            return { success: false, message: 'no user found', data: [] };
        } catch (error) {
            console.log('error occured while fetching user:', error);
            return { success: false, message: 'error occured', error: error };
        }

    }

    async getUserById(userId) {
        try {
            const results = await this.userRepository.getUserById(userId);

            if (results) {
                return { success: true, message: 'User fetched successfully', data: results };
            }

            return { success: false, message: 'no user found', data: null };
        } catch (error) {
            console.log('error occured while fetching user:', error);
            return { success: false, message: 'error occured', error: error };
        }

    }

    async createUser(userData) {
        try {

            const { first_name, last_name, password, email, dep_id, role_id, company_id } = userData;

            const user = await this.userRepository.getUserByEmail(email);

            if (user) {
                return { success: false, message: 'email already exists', data: null };
            }

            const hashedPassword = await this.hashHelper.hashPassword(password);

            const results = await this.userRepository.createUser({ first_name, last_name, email, password: hashedPassword, dep_id , role_id, company_id});

            if (results) {
                return { success: true, message: 'User created successfully', data: results };
            }

            return { success: false, message: 'failed to created', data: null };
        } catch (error) {
            console.log('error occured while creating user:', error);
            return { success: false, message: 'error occured', error: error };
        }
    }

    async loginUser(userData, res, req) {
        try {

            const { password, email } = userData;

            const user = await this.userRepository.getUserByEmail(email);

            if (!user) {
                return { success: false, message: 'User does not exist', data: null };
            }

            const isValidPassword = await this.hashHelper.comparePassword(password, user.password);

            if(!isValidPassword){
                return { success: false, message: 'Password not correct', data: null };
            }

            const {accessToken, refreshToken} = await this.tokenUtil.generateTokensAndSetCookies(res, user.id, req )

            const loginResults = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role_id: user.role_id,
                accessToken: accessToken,
                refreshToken: refreshToken
            }

            return { success: true, message: 'Logged in successfully', data: loginResults };
        } catch (error) {
            console.log('error occured while logging user:', error);
            return { success: false, message: 'error occured', error: error };
        }
    }

    async updateUser(userId, userData) {
        try {
            const user = await this.userRepository.getUserById(userId);

            if(!userData.password || userData.password.trim() === ''){
                userData.password = user.password
            }else{
                userData.password = await this.hashHelper.hashPassword(userData.password)
            }

            const results = await this.userRepository.updateUser(userId, userData);

            if (results) {
                return { success: true, message: 'User updated successfully', data: results };
            }

            return { success: false, message: 'failed to update', data: null };
        } catch (error) {
            console.log('error occured while updating user:', error);
            return { success: false, message: 'error occured', error: error };
        }
    }

    async deleteUser(userId, userData) {
        try {
            const results = await this.userRepository.deleteUser(userId, userData);

            if (results) {
                return { success: true, message: 'User deleted successfully', data: results };
            }

            return { success: false, message: 'failed to delete', data: null };
        } catch (error) {
            console.log('error occured while deleting user:', error);
            return { success: false, message: 'error occured', error: error };
        }
    }
};

module.exports = UserServices;