import { Router } from "express";
import { login, registerUser } from "../controllers/auth/register.controler.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { credentialsSchema, otpVerificationSchema } from "../validations/auth.validation.js";
import { verifyRegisterOtp } from "../controllers/auth/otp.controler.js";

const authRouter = Router();

authRouter.post("/register", validateRequest(credentialsSchema) , registerUser);
authRouter.post("/login", login);
authRouter.post("/verify-otp", validateRequest(otpVerificationSchema), verifyRegisterOtp);

export default authRouter;