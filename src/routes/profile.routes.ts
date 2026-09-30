import { Router } from "express";
import { getProfile } from "../controllers/profile/profile.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

const profileRouter = Router();

profileRouter.get("/", authenticate, getProfile);

export default profileRouter;
