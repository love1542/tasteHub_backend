import { Router } from "express";
import { completeRegistration, login, registerUser } from "../controllers/auth/register.controler.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { completeRegistrationSchema, credentialsSchema, otpVerificationSchema } from "../validations/auth.validation.js";
import { verifyRegisterOtp } from "../controllers/auth/otp.controler.js";
import upload from "../utils/handleFormData.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

const authRouter = Router();

authRouter.post("/register", validateRequest(credentialsSchema) , registerUser);
authRouter.post("/login", login);
authRouter.post("/verify-otp", validateRequest(otpVerificationSchema), verifyRegisterOtp);
authRouter.post("/complete-registration",authenticate, upload.single("profileImage"), validateRequest(completeRegistrationSchema), completeRegistration);

export default authRouter;