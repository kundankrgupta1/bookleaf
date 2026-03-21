import jwt from 'jsonwebtoken';
import { config } from '../config/service.config.js';
import { ApiError } from '../utils/ApiError.js';
const { accessTokenKey, accessTokenExpiresIn, refreshTokenKey, refreshTokenExpiresIn } = config.jwt;

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, accessTokenKey);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(500, 'Token Expired');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(500, 'Invalid Token');
        }
        throw error;
    }
};

export const accessToken = (payload) => {
    try {
        return jwt.sign(payload, accessTokenKey, { expiresIn: accessTokenExpiresIn });
    } catch (error) {
        return false;
    }
};

export const refreshToken = (payload) => {
    try {
        return jwt.sign(payload, refreshTokenKey, { expiresIn: refreshTokenExpiresIn });
    } catch (error) {
        return false;
    }
};
