import type { NextFunction, Request, Response } from "express";
import { listRestaurants } from "../../services/restaurant.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import type { GetRestaurantsQuery } from "../../validations/restaurant.validation.js";

export const getRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = res.locals.validatedQuery as GetRestaurantsQuery;
    
    const result = await listRestaurants(query, res.locals.user_id as string);

    return ApiResponse(res, result, "Restaurants fetched successfully", 200);
  } catch (error) {
    next(error);
  }
};
