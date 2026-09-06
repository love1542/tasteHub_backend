import type { Request, Response } from "express";
import User from "../../models/user.model.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import AppError from "../../utils/errorHandling.js";
import { createUser } from "../../services/auth.service.js";
import { sendOtp } from "./otp.controler.js";

export const login = async (req: Request, res: Response) => {
  res.json({
    message: "Login successful",
  });
};

export const registerUser = async (req: Request, res: Response) => {
    const { type, identifier, password } = req.body
    
    try {
        const newUser = await createUser(type, identifier, password);

        await sendOtp(newUser.user_id, type === "email" ? "register_email" : "register_phone");

        ApiResponse(res, newUser, "OTP Sent Successfully", 201);
    } catch (error) {
        throw error;
    }
};