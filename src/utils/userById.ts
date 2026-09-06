import User from "../models/user.model.js";
import AppError from "./errorHandling.js";

export const getUserById = async (userId: string) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
    
  } catch (error) {
    throw error;
  }
}