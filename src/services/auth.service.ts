import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/errorHandling.js";
import bcrypt from "bcrypt"

export const createUser = async (type: string, identifier: string, password?: string) => {
    try {
        let newUser;

        if (type === "email") {
            const existingUser = await User.findOne({ where: { email: identifier } });
            if (existingUser) {
                throw new AppError("User already exists", 401);
            }
            const hashedPassword = password ? await createHashedPassword(password) : undefined;
            newUser = await User.create({ email: identifier, password: hashedPassword });

        } else if (type === "phone") {
            const existingUser = await User.findOne({ where: { phone: identifier } });
            if (existingUser) {
                throw new AppError("User already exists", 401);
            }

            newUser = await User.create({ phone: identifier });

        } else {
            console.error("Invalid type. Must be 'email' or 'phone'.");
            throw new AppError("Invalid type. Must be 'email' or 'phone'.", 401);
        }

        const data = {
            user_id: newUser.user_id,
            phone: newUser.phone,
            email: newUser.email,
            email_verified: newUser.email_verified,
            phone_verified: newUser.phone_verified,
            created_at: newUser.createdAt,
            updated_at: newUser.updatedAt
        }

        return data;
    } catch (error) {
        throw error;
    }
}


export const createHashedPassword = async (password: string): Promise<string> => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new AppError("Failed to hash password", 500);
    }
}


export const verifyOtp = async (userId: string, otpCode: string, purpose: "login_email" | "login_phone" | "reset_password" | "register_email" | "register_phone") => {
    try {
        const otpRecord = await OTP.findOne({
            where: {
                user_id: userId,
                purpose: purpose,
                otp_code: otpCode,
            },
        });

        if (!otpRecord) {
            throw new AppError("Invalid OTP", 400);
        }

        if (otpRecord.expiras_at < new Date()) {
            throw new AppError("OTP has expired", 400);
        }

        if (purpose === "register_email") {
            await User.update({ email_verified: true }, { where: { user_id: userId } });
        } else if (purpose === "register_phone") {
            await User.update({ phone_verified: true }, { where: { user_id: userId } });
        }

        await otpRecord.destroy();

        return true;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error;
    }

}