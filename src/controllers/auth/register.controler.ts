import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse.js";
import { createUser } from "../../services/auth.service.js";
import { sendOtp } from "./otp.controler.js";
import { uploadCloudinary } from "../../services/cloudinary.service.js";
import AppError from "../../utils/errorHandling.js";
import DEFAULT_IMAGES from "../../models/defaultImages.model.js";

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
    const { fullName, gender, dateOfBirth, imageType, imageId } = req.body;
    console.log(req.file)

    try {
        let image: string | null = null
        let public_id: string | null = null

        if (imageType === "uploaded") {

            if (!req.file) {
                throw new AppError(
                    "Profile image is required",
                    400
                );
            }

            const imageData = await uploadCloudinary(req.file?.path, "tastehub_test/profile/user_images")
            image = imageData.secure_url

            public_id = imageData.public_id
        }

        if (imageType == "default") {
            if (req.file) {
                throw new AppError(
                    "File is not allowed for default image",
                    400
                );
            }

            const imageData = await DEFAULT_IMAGES.findOne({ where: { id: imageId } })

            if (!imageData) {
                throw new AppError(
                    "please check default image",
                    400
                );
            }
            image = imageData.imageUrl
        }


        ApiResponse(res, { fullName, gender, dateOfBirth, image }, "Registration completed successfully", 200);
    } catch (error) {
        console.log(error)
        throw error;
    }

}