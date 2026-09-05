class AppError extends Error {
  statusCode: number;
  status: string;
  details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    details?: unknown,
  ) {
    super(message);

    this.statusCode = statusCode;

    this.status = `${statusCode}`.startsWith("4")
      ? "fail"
      : "error";

    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;