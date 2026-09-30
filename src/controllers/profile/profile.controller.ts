import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse.js";
import { getUserById } from "../../utils/userById.js";

export const getProfile = async (_req: Request, res: Response) => {
    const user = await getUserById(res.locals.user_id);

    const profile = {
        userId: user.user_id,
        email: user.email,
        phone: user.phone,
        fullName: user.full_name,
        imageUrl: user.image_url,
        gender: user.gender,
        dateOfBirth: user.date_of_birth,
        emailVerified: user.email_verified,
        phoneVerified: user.phone_verified,
    };

    return ApiResponse(res, profile, "Profile fetched successfully", 200);
};
