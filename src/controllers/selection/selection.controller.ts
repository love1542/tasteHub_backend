import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse.js";
import DEFAULT_IMAGES from "../../models/defaultImages.model.js";

export const getDefaultImages = async (req: Request, res: Response) => {
    try {
        const defaultImages: Array<InstanceType<typeof DEFAULT_IMAGES>> = await DEFAULT_IMAGES.findAll({
            where: { isActive: true },
        });

        const response = defaultImages.map((image) => ({
            id: image.id,
            imageUrl: image.imageUrl,
        }));

        return ApiResponse(res, response, "Default images fetched successfully", 200);
    } catch (error) {
        throw error;
    }
};