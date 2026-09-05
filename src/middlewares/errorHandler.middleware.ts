import type { ErrorRequestHandler } from "express";
import AppError from "../utils/errorHandling.js";

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
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
