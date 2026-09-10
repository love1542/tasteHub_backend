import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/errorHandling.js";
import { verifyAccessToken } from "../utils/tokenManger.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const header = req.headers.authorization

        if (!header) {
            throw new AppError("Authetication required", 401)
        }

        const [type, token] = header.split(" ");

        if (type !== "Bearer" || !token) {
            throw new AppError("invalid autheticate format", 401)
        }

        const decoded = verifyAccessToken(token)

        console.log("decoded id:",decoded)

        res.locals.user_id = decoded.userId
        
        next()

    } catch (error) {
        console.log(error)

        throw error
    }
}