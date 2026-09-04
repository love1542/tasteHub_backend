import type { Request, Response } from "express";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

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
                return ApiResponse.error(res, "Email already exists", 400, "EMAIL_ALREADY_EXISTS");
            }
            newuser = await User.create({ email: identifier, password });
        } else if (type === "phone") {
            const existingUser = await User.findOne({ where: { phone: identifier } });
            if (existingUser) {
                return ApiResponse.error(res, "Phone number already exists", 400, "PHONE_ALREADY_EXISTS");
            }
            newuser = await User.create({ phone: identifier, password });
        }
        return ApiResponse.success(res, newuser, "User registered successfully", 201);
    } catch (error) {
        console.error("Error registering user:", error);
        return ApiResponse.error(res, "Failed to register user", 500, "USER_REGISTRATION_FAILED", error);
    }
};