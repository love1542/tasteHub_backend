import type { Response } from "express";

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message = "Something went wrong",
    statusCode = 500,
    code?: string,
    error?: unknown
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: {
        code,
        ...(error !== undefined ? { details: error } : {}),
      },
    });
  }
}