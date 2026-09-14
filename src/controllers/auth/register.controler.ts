import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse.js";
import { createUser } from "../../services/auth.service.js";
import { sendOtp } from "./otp.controler.js";
import { uploadCloudinary } from "../../services/cloudinary.service.js";
import AppError from "../../utils/errorHandling.js";
import DEFAULT_IMAGES from "../../models/defaultImages.model.js";
import { getUserById } from "../../utils/userById.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/tokenManger.js";
import REFRESH_TOKENS from "../../models/refreshTokens.model.js";

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
    const { fullName, gender, dateOfBirth, imageType, imageId, deviceId } = req.body;
    const user_id = res.locals.user_id;

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

        const user = await getUserById(user_id)

        user.image_url = image
        user.public_id = public_id
        user.date_of_birth = dateOfBirth
        user.gender = gender
        user.full_name = fullName

        await user.save()

        const refreshToken = generateRefreshToken(user_id)
        const accessToken = generateAccessToken(user_id)
        const expireAt = Date.now() + 7 * 24 * 60 * 60 * 1000

        const {
            password,
            createdAt,
            updatedAt,
            ...userData
        } = user.toJSON();

        await REFRESH_TOKENS.create({
            user_id: user_id,
            refresh_token: refreshToken,
            expires_at: expireAt,
            device_id: deviceId,
        })

        ApiResponse(res, { userData, refreshToken, accessToken }, "Registration completed successfully", 200);

    } catch (error) {
        console.log(error)
        throw error;
    }

}

export const getRefreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        throw new AppError("please send refresh token", 400)
    }

    const decodeRefreshToken = verifyRefreshToken(refreshToken)

}