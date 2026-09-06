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
