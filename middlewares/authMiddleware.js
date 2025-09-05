const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

class VerifyToken {
    authToken = async (req, res, next) => {

        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        try {
            const decoded = await jwt.verify(accessToken, process.env.JWT_SECRET)
            req.userId = decoded.userId
            return next();
        } catch (error) {
            console.log('Error:', error);
        }

        if (!refreshToken) {
            if (req.session) {
                req.session.destroy(error => {
                    if (error) {
                        console.log('error while destroying session:', error);
                    }
                })
            }

            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return res.status(401).json({
                status: 401,
                success: true,
                message: 'Invalid Token or token expired'
            })
        }

        try {
            const storedToken = req.session.refreshToken;

            if (!storedToken || storedToken !== refreshToken) {
                if (req.session) {
                    req.session.destroy(error => {
                        if (error) {
                            console.log('error while destroying session:', error);
                        }
                    })
                }

                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');

                return res.status(401).json({
                    status: 401,
                    success: true,
                    message: 'Invalid Token or token expired'
                })
            }

            const decoded = await jwt.verify(refreshToken, process.env.JWT_SECRET)
            const userId = decoded.userId

            const newAccessToken = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
            const newRefreshToken = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return next();
        } catch (error) {
            if (req.session) {
                req.session.destroy(error => {
                    if (error) {
                        console.log('error while destroying session:', error);
                    }
                })
            }

            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return res.status(500).json({
                status: 500,
                success: true,
                message: 'Invalid Token or token expired',
                data: error
            })
        }
    }

}

module.exports = VerifyToken;