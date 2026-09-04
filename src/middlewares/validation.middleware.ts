import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ApiResponse } from "../utils/apiResponse.js";

export const validateRequest = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {

            const errors: Record<string, string> = {};

            const unexpectedKeys = result.error.issues
                .filter(issue => issue.code === 'unrecognized_keys')
                .flatMap(issue => issue.keys);

            if (unexpectedKeys.length > 0) {

                unexpectedKeys.forEach(key => {
                    errors[key] = `Unexpected parameter '${key}'`;
                });

            } else {

                result.error.issues.forEach(issue => {

                    const field = issue.path.length > 0 ? issue.path.join(".") : "_form";

                    errors[field] = issue.message;

                });
            }

            return ApiResponse.error(res, "Validation failed", 400, "VALIDATION_ERROR", errors);
        }

        req.body = result.data;

        next();
    };
};