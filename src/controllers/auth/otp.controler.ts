import { generateOTP } from "../../utils/otpGenrator.js";
import type { Request, Response } from "express";
import OTP from "../../models/otp.model.js";
import AppError from "../../utils/errorHandling.js";
import { verifyOtp } from "../../services/auth.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenManger.js";
import REFRESH_TOKENS from "../../models/refreshTokens.model.js";

type OtpPurpose = "login_phone" | "reset_password" | "register_email" | "register_phone";

type OtpVerificationBody = {
    type: "email" | "phone";
    identifier: string;
    otpCode: string;
    purpose: OtpPurpose;
    deviceId?: string;
};

export const sendOtp = async (userId: string, purpose: "login_phone" | "reset_password" | "register_email" | "register_phone") => {
    try {
        const oldOtp = await OTP.findOne({ where: { user_id: userId, purpose: purpose } })

        if (!oldOtp) {
            const otp = generateOTP();
            // Do something with the generated OTP, e.g., send it via email or SMS
            console.log("Generated OTP:", otp);
            await OTP.create({
                user_id: userId,
                otp_code: otp,
                purpose: purpose,
                expiras_at: new Date(Date.now() + 5 * 60 * 1000), // Set expiration time (e.g., 5 minutes from now)
                last_sent_at: new Date(Date.now()),
                rate_limit_reset_at: new Date(Date.now() + 10 * 60 * 1000)
            });

            return
        }

        if (oldOtp.rate_limit_reset_at <= new Date(Date.now())) {

            const otp = generateOTP();

            console.log("Generated OTP:", otp);

            oldOtp.otp_code = otp;
            oldOtp.attempts = 0;
            oldOtp.send_count = 1;
            oldOtp.expiras_at = new Date(
                Date.now() + 5 * 60 * 1000
            );
            oldOtp.last_sent_at = new Date(Date.now());
            oldOtp.rate_limit_reset_at = new Date(
                Date.now() + 10 * 60 * 1000
            );

            await oldOtp.save();

            return;
        }

        if (oldOtp.send_count >= 3) {
            throw new AppError("Too many requests, please try after some time", 429)
        }

    } catch (error) {
        console.error("Error generating OTP:", error);
        throw new AppError("Failed to generate OTP", 500);
    }
}

export const verifyOtpCode = async (req: Request<{}, {}, OtpVerificationBody>, res: Response) => {
    try {
        const { type, identifier, otpCode, purpose, deviceId } = req.body;

        if ((purpose === "login_phone") && !deviceId) {
            throw new AppError("Invalid request", 400, "deviceId not found");
        }

        const userId = await verifyOtp(type, identifier, otpCode, purpose);

        switch (purpose) {
            case "register_email":
            case "register_phone": {
                const accessToken = generateAccessToken(userId);
                return ApiResponse(res, { access_token: accessToken }, "OTP verified successfully", 200);
            }
            case "login_phone": {
                const accessToken = generateAccessToken(userId);
                const refreshToken = generateRefreshToken(userId);
                const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                const existingToken = await REFRESH_TOKENS.findOne({
                    where: { user_id: userId, device_id: deviceId! },
                });

                if (existingToken) {
                    existingToken.refresh_token = refreshToken;
                    existingToken.expires_at = expiresAt;
                    await existingToken.save();
                } else {
                    await REFRESH_TOKENS.create({
                        user_id: userId,
                        refresh_token: refreshToken,
                        expires_at: expiresAt,
                        device_id: deviceId!,
                    });
                }

                return ApiResponse(res, { access_token: accessToken, refresh_token: refreshToken }, "OTP verified successfully", 200);
            }
            case "reset_password": {
                return ApiResponse(res, { verified: true }, "OTP verified successfully", 200);
            }
            default:
                throw new AppError("Invalid Purpose", 400);
        }

    } catch (error) {
        throw error;
    }
}