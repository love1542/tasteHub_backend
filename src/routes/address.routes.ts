import { Router } from "express";
import { getUserAddresses } from "../controllers/address/address.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

const addressRouter = Router();

addressRouter.get("/", authenticate, getUserAddresses);

export default addressRouter;