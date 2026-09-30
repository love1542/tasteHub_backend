import { Router } from "express";
import { completeRegistration, getRefreshToken, login, registerUser } from "../controllers/auth/register.controler.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { completeRegistrationSchema, credentialsSchema, loginSchema, otpVerificationSchema, refreshTokenSchema } from "../validations/auth.validation.js";
import { verifyOtpCode } from "../controllers/auth/otp.controler.js";
import upload from "../utils/handleFormData.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

const authRouter = Router();

authRouter.post("/register", validateRequest(credentialsSchema) , registerUser);
authRouter.post("/login", validateRequest(loginSchema), login);
authRouter.post("/verify-otp", validateRequest(otpVerificationSchema), verifyOtpCode);
authRouter.post("/complete-registration",authenticate, upload.single("profileImage"), validateRequest(completeRegistrationSchema), completeRegistration);
authRouter.post("/refresh-token", validateRequest(refreshTokenSchema), getRefreshToken)

export default authRouter;