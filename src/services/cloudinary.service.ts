import {v2 as cloudinary} from 'cloudinary'
import fs from "fs/promises";
import AppError from '../utils/errorHandling.js'

export const uploadCloudinary = async (filePath: string, folder: string) => {

    if (!filePath) {
        throw new AppError("server error", 400, "filepth is missing")
    }

    try {
      const image = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: 'image'
        })

        await fs.unlink(filePath)

        return image

    } catch (error) {
        console.log(error)
        await fs.unlink(filePath).catch(() => {});

        throw new AppError("Server error", 500, "image uploading server problem")
    }
}