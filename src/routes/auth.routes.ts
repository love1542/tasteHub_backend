import { Router } from "express";
import { login, registerUser } from "../controllers/auth/register.controler.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { credentialsSchema } from "../validations/auth.validation.js";
import { sendOtp } from "../controllers/auth/otp.controler.js";

const authRouter = Router();

authRouter.post("/register", validateRequest(credentialsSchema) , registerUser);
authRouter.post("/login", login);
// authRouter.get("/verify-otp", sendOtp);

export default authRouter;