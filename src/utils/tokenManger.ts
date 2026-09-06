import { env } from "../config/env.js";
import AppError from "./errorHandling.js";
import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string): string => {
    const payload = { userId };
    const secretKey = env.accessTokenSecret;

    if (!secretKey) {
        throw new AppError("Access token secret key is not defined", 500);
    }

    const token = jwt.sign(payload, secretKey, {expiresIn: "1h"});
    return token;
};

export const verifyAccessToken = (token: string): { userId: string } => {
    const secretKey = env.accessTokenSecret;
    if (!secretKey) {
        throw new AppError("Access token secret key is not defined", 500);
    }

    try {
        const decoded = jwt.verify(token, secretKey) as { userId: string };
        return decoded;
    } catch (error) {
        throw new AppError("Invalid or expired access token", 401);
    }
};

export const generateRefreshToken = (userId: string): string => {
    const payload = { userId };
    const secretKey = env.refreshTokenSecret;

    if (!secretKey) {
        throw new AppError("Refresh token secret key is not defined", 500);
    }

    const token = jwt.sign(payload, secretKey, {expiresIn: "7d"});
    return token;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
    const secretKey = env.refreshTokenSecret;
    
    if (!secretKey) {
        throw new AppError("Refresh token secret key is not defined", 500);
    }

    try {
        const decoded = jwt.verify(token, secretKey) as { userId: string };
        return decoded;
    } catch (error) {
        throw new AppError("Invalid or expired refresh token", 401);
    }
};

