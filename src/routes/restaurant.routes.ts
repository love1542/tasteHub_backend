import { Router } from "express";
import { getRestaurants } from "../controllers/restaurant/restaurant.controller.js";
import { validateQuery } from "../middlewares/validation.middleware.js";
import { getRestaurantsQuerySchema } from "../validations/restaurant.validation.js";

const restaurantRouter = Router();

restaurantRouter.get("/", validateQuery(getRestaurantsQuerySchema), getRestaurants);

export default restaurantRouter;
