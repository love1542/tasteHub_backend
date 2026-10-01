// src/routes/index.ts

import { Router } from "express";
import authRouter from "./auth.routes.js";
import selectionRoute from "./selections.routes.js";
import profileRouter from "./profile.routes.js";
import addressRouter from "./address.routes.js";
import restaurantRouter from "./restaurant.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/selection", selectionRoute)
router.use("/profile", profileRouter);
router.use("/addresses", addressRouter)
router.use("/restaurants", restaurantRouter);

export default router;