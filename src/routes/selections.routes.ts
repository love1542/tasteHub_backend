import { Router } from "express";
import { getDefaultImages } from "../controllers/selection/selection.controller.js";

const selectionRoute = Router()

selectionRoute.get("/default-images", getDefaultImages)

export default selectionRoute