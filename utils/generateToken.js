const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

class TokenService {
    async generateToken(userId, req) {
        const accessToken = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

        req.session.refreshToken;
        return { accessToken, refreshToken }
    }

    async setCookie(res, accessToken, refreshToken) {
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    }

    async generateTokensAndSetCookies(res, userId, req) {
        const { accessToken, refreshToken } = await this.generateToken(userId, req);

        await this.setCookie(res, accessToken, refreshToken);

        return { accessToken, refreshToken };
    }
};

module.exports = TokenService;