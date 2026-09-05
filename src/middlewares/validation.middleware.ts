import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import AppError from "../utils/errorHandling.js";

export const validateRequest = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {

            const errors: Record<string, string> = {};

            result.error.issues.forEach(issue => {
                if (issue.code === "unrecognized_keys") {
                    issue.keys.forEach(key => {
                        errors[key] = `Unexpected parameter '${key}'`;
                    });
                    return;
                }

                if (issue.code === "invalid_union" && "discriminator" in issue) {
                    const discriminator = String(issue.discriminator);
                    const options = "options" in issue && Array.isArray(issue.options)
                        ? issue.options.join("' | '")
                        : "valid values";

                    errors[discriminator] = `Invalid parameter '${discriminator}'. Expected '${options}'`;
                    return;
                }

                const field = issue.path.length > 0 ? issue.path.join(".") : "_form";
                errors[field] = issue.message;
            });

            console.log("Validation errors:", errors);
            throw new AppError("validation error", 400, errors);
        }

        req.body = result.data;

        next();
    };
};