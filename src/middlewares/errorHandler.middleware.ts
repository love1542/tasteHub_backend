import type { ErrorRequestHandler } from "express";
import AppError from "../utils/errorHandling.js";
import { MulterError } from "multer";
import { ApiResponse } from "../utils/apiResponse.js";

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {

	if (error instanceof MulterError) {
		if (error.code === "LIMIT_FILE_SIZE") {
			return ApiResponse(res, {},"Please upload upto 5 mb", 500)
		}
	}
	const appError = error instanceof AppError
		? error
		: new AppError("Internal server error", 500);
        
	return res.status(appError.statusCode).json({
		success: false,
		message: appError.message,
		...(appError.details !== undefined
			? { error: { details: appError.details } }
			: {}),
	});
};

export default errorHandler;
