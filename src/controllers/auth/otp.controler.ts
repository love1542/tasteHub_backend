import { generateOTP } from "../../utils/otpGenrator.js";
import type { Request, Response } from "express";
import OTP from "../../models/otp.model.js";
import AppError from "../../utils/errorHandling.js";
import { verifyOtp } from "../../services/auth.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenManger.js";
import { getRefreshToken } from "./register.controler.js";
import REFRESH_TOKENS from "../../models/refreshTokens.model.js";

type OtpPurpose = "login_phone" | "login_email" | "reset_password" | "register_email" | "register_phone";

type OtpVerificationBody = {
    userId: string;
    otpCode: string;
    purpose: OtpPurpose;
    deviceId?: string;
};

export const sendOtp = async (userId: string, purpose: "login_email" | "login_phone" | "reset_password" | "register_email" | "register_phone") => {
    const otp = generateOTP();
    // Do something with the generated OTP, e.g., send it via email or SMS
    console.log("Generated OTP:", otp);
    try {
        await OTP.create({
            user_id: userId,
            otp_code: otp,
            purpose: purpose,
            expiras_at: new Date(Date.now() + 5 * 60 * 1000), // Set expiration time (e.g., 5 minutes from now)
        });

    } catch (error) {
        console.error("Error generating OTP:", error);
        throw new AppError("Failed to generate OTP", 500);
    }
}

export const verifyRegisterOtp = async (req: Request<{}, {}, OtpVerificationBody>, res: Response) => {
    try {
        const { userId, otpCode, purpose, deviceId } = req.body;

        if ( (purpose === "login_phone" || purpose === "login_email") && !deviceId ) {
            throw new AppError("invalid request", 400, "deviceId not found")
        }

        const verify = await verifyOtp(userId, otpCode, purpose);

        if (!verify) {
            throw new AppError("Invalid or expired OTP", 400);
        }

        switch (purpose) {
            case "register_email":
            case "register_phone": {

                const accessToken = generateAccessToken(userId);

                ApiResponse(res, {access_token: accessToken}, "Otp verify Successfully", 200);
            }

            case "login_phone": {


                const accessToken = generateAccessToken(userId);
                const refreshToken = generateRefreshToken(userId);
                const newExpireDate = new Date(Date.now() + 5 * 60 * 1000)

                const oldToken = await REFRESH_TOKENS.findOne({ where: { user_id: userId, device_id: deviceId } })

                if (!oldToken) {
                    throw new AppError("invalid cerdentials", 401, "Account not activate")
                }

                oldToken.refresh_token = refreshToken
                oldToken.expires_at = newExpireDate

                await oldToken.save()

                ApiResponse(res, { accessToken, refreshToken }, "OTP verified successfully", 200)
            }
            default:
                throw new AppError("Invalid Purpose", 400);
        }

    } catch (error) {
        throw error;
    }
}