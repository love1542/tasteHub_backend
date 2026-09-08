import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse.js";
import { createUser } from "../../services/auth.service.js";
import { sendOtp } from "./otp.controler.js";
import { uploadCloudinary } from "../../services/cloudinary.service.js";

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

export const completeRegistration = async (req: Request, res: Response) => {
    const { fullName, gender, dateOfBirth } = req.body;
    const profileImage = req.file ? req.file.filename : null;
    try {
        const image = await uploadCloudinary(req.file?.path ?? "/upload", "tastehub/profile")

         ApiResponse(res, { fullName, gender, dateOfBirth, profileImage, image }, "Registration completed successfully", 200);
    } catch (error) {
        console.log(error)
        throw error;
    }

}