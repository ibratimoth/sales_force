const User = require('../models/userModel');
const { departmentRelation, roleRelation } = require('../models/relationship');

class UserRepositories {

    async getAllUsers() {
        return await User.findAll({
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: departmentRelation,
                    attributes: ['name', 'label']
                },
                {
                    model: roleRelation,
                    attributes: ['name']
                }
            ]
        })
    }

    async getUserById(id) {
        return await User.findByPk(id);
    }

    async createUser(userData) {
        const user = await User.create(userData);
        const savedUser = await User.findByPk(user.id, {
            attributes: { exclude: ['password'] }
        });
        return savedUser;
    }

    async getUserByEmail(email) {
        return await User.findOne({ where: { email: email } })
    }

    async updateUser(userId, userData) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error("User not found");
        }

        await user.update(userData);
        return user;
    }

    async deleteUser(userId) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return await User.destroy({ where: { id: userId } })
    }
}

module.exports = UserRepositories;