import type { Request, Response } from "express";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import AppError from "../utils/errorHandling.js";

export const login = async (req: Request, res: Response) => {
  res.json({
    message: "Login successful",
  });
};

export const registerUser = async (req: Request, res: Response) => {
    const { type, identifier, password } = req.body
    
    try {
        let newuser;
        if (type === "email") {
            const existingUser = await User.findOne({ where: { email: identifier } });
            if (existingUser) {
                throw new AppError("user already exists", 409);
            }
            newuser = await User.create({ email: identifier, password });
        } else if (type === "phone") {
            const existingUser = await User.findOne({ where: { phone: identifier } });
            if (existingUser) {
                throw new AppError("user already exists", 409);
            }
            newuser = await User.create({ phone: identifier, password });
        }
        return ApiResponse(res, newuser, "User registered successfully", 201);
    } catch (error) {
        console.error("Error registering user:", error);

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Failed to register user", 500);
    }
};