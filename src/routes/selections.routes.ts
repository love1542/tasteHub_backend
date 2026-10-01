import { Router } from "express";
import { getCuisines, getDefaultImages } from "../controllers/selection/selection.controller.js";

const selectionRoute = Router()

selectionRoute.get("/default-images", getDefaultImages)
selectionRoute.get("/cuisines", getCuisines)

export default selectionRoute