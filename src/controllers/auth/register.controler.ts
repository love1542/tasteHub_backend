import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse.js";
import { assertAccountCanLogin, checkUserByEmailOrPhone, createUser, verifyHashedPassword } from "../../services/auth.service.js";
import { sendOtp } from "./otp.controler.js";
import { uploadCloudinary } from "../../services/cloudinary.service.js";
import AppError from "../../utils/errorHandling.js";
import DEFAULT_IMAGES from "../../models/defaultImages.model.js";
import { getUserById } from "../../utils/userById.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenManger.js";
import REFRESH_TOKENS from "../../models/refreshTokens.model.js";
import { getUserRoleFromHeader } from "../../utils/userRole.js";

export const login = async (req: Request, res: Response) => {
    const { type, identifier, password, deviceId } = req.body
    const role = getUserRoleFromHeader(req.headers["x-user-role"]);

    try {
        const user = await checkUserByEmailOrPhone(type, identifier, role)
        assertAccountCanLogin(user, type);

        if (type === "email") {
            const verify = await verifyHashedPassword(password, user.password ?? "")
            if (verify) {
                const accessToken = generateAccessToken(user.user_id)
                const refreshToken = generateRefreshToken(user.user_id)
                const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                const existingToken = await REFRESH_TOKENS.findOne({
                    where: { user_id: user.user_id, device_id: deviceId },
                })

                if (existingToken) {
                    existingToken.refresh_token = refreshToken
                    existingToken.expires_at = expiresAt
                    await existingToken.save()
                } else {
                    await REFRESH_TOKENS.create({
                        user_id: user.user_id,
                        refresh_token: refreshToken,
                        expires_at: expiresAt,
                        device_id: deviceId,
                    })
                }

                return ApiResponse(res, {accessToken, refreshToken }, "Login successful", 200)
            } else {
                throw new AppError("wrong password", 401)
            }
        }

        if (type === "phone") {
            await sendOtp(user.user_id, "login_phone")
            return ApiResponse(res, "otp send successfully", "", 200)
        }


    } catch (error) {
        throw error
    }

};

export const registerUser = async (req: Request, res: Response) => {
    const { type, identifier, password } = req.body
    const role = getUserRoleFromHeader(req.headers["x-user-role"]);

    try {
        const newUser = await createUser(type, identifier, password, role);

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
        const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        await REFRESH_TOKENS.create({
            user_id: user_id,
            refresh_token: refreshToken,
            expires_at: expireAt,
            device_id: deviceId,
        })

        ApiResponse(res, { refreshToken, accessToken }, "Registration completed successfully", 200);

    } catch (error) {
        console.log(error)
        throw error;
    }

}

export const getRefreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken, deviceId } = req.body

        const existToken = await REFRESH_TOKENS.findOne({ where: { refresh_token: refreshToken, device_id: deviceId } })

        if (!existToken) {
            throw new AppError("Invalid Refresh Token", 401, "check your refresh token")
        }

        if (existToken.expires_at.getTime() < Date.now()) {
            await existToken.destroy()
            throw new AppError("Login again", 401, "expire user session");
        }

        const newRefreshToken = generateRefreshToken(existToken.user_id)
        const newAccessToken = generateAccessToken(existToken.user_id)

        existToken.refresh_token = newRefreshToken
        existToken.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        await existToken.save()

        ApiResponse(res, { refreshToken: newRefreshToken, accessToken: newAccessToken }, "succussfully ", 200)
    } catch (error) {
        console.log("refresh token time error", error)
        throw error
    }

}