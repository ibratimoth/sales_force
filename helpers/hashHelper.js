const bcrypt = require('bcryptjs');

class PasswordService{
    async hashPassword(password){
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    }

    async comparePassword(plainPassword, hashedPassword){
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = PasswordService;