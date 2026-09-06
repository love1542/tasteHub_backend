import { generateOTP } from "../../utils/otpGenrator.js";
import OTP from "../../models/otp.model.js";
import AppError from "../../utils/errorHandling.js";

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