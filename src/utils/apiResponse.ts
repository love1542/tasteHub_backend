import type { Response } from "express";

export const ApiResponse = <T>(res: Response, data: T, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
