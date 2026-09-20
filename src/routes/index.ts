// src/routes/index.ts

import { Router } from "express";
import authRouter from "./auth.routes.js";
import selectionRoute from "./selections.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/selection", selectionRoute)

export default router;