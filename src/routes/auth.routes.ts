import { Router } from "express";
import { login, registerUser } from "../controllers/auth.controler.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { credentialsSchema } from "../services/validations/auth.validation.js";

const authRouter = Router();

authRouter.post("/register", validateRequest(credentialsSchema) , registerUser);
authRouter.post("/login", login);

export default authRouter;