import { Op, Sequelize, type Order } from "sequelize";
import {
  Cuisine,
  Rating,
  Restaurant,
  RestaurantAddress,
  RestaurantHour,
} from "../models/index.js";
import type { CuisineResponse } from "../models/cuisine.model.js";
import { RestaurantStatus, SortOrder, VALID_SORT_FIELDS } from "../constants.js";
import type { GetRestaurantsQuery } from "../validations/restaurant.validation.js";

type RestaurantHourLike = {
  day_of_week?: number | string | null;
  is_closed?: boolean | null;
  open_time?: string | Date | null;
  close_time?: string | Date | null;
};

export const getIsRestaurantOpen = (hours: RestaurantHourLike[] = []) => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todaysHours = hours.filter((slot) => Number(slot.day_of_week) === currentDay);

  if (todaysHours.length === 0) {
    return false;
  }

  return todaysHours.some((slot) => {
    if (slot.is_closed) {
      return false;
    }

    const openParts = String(slot.open_time ?? "00:00").split(":").map(Number);
    const closeParts = String(slot.close_time ?? "00:00").split(":").map(Number);

    const openHour = openParts[0] ?? 0;
    const openMinute = openParts[1] ?? 0;
    const closeHour = closeParts[0] ?? 0;
    const closeMinute = closeParts[1] ?? 0;

    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;

    if (closeMinutes <= openMinutes) {
      return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
    }

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  });
};


export const listRestaurants = async (query: GetRestaurantsQuery) => {
  const { page, limit, cuisineId, search, sortBy, sortOrder } = query;
  const offset = (page - 1) * limit;

  const whereClause = {
    status: RestaurantStatus.Approved,
    ...(search ? { name: { [Op.iLike]: `%${search}%` } } : {}),
  };
  const orderDirection = sortOrder ?? SortOrder.DESC;
  const orderClause: Order = sortBy && VALID_SORT_FIELDS.has(sortBy)
    ? [[sortBy, orderDirection]]
    : [["created_at", "DESC"]];

  const { count, rows: restaurants } = await Restaurant.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: orderClause,
    attributes: [
      "restaurant_id",
      "name",
      "cover_image",
      "delivery_fee",
      "minimum_order",
      "min_delivery_minutes",
      "max_delivery_minutes",
    ],
    include: [
      {
        model: RestaurantAddress,
        as: "addresses",
        attributes: ["city", "state", "area"],
        required: false,
        separate: true,
        limit: 1,
      },
      {
        model: RestaurantHour,
        as: "hours",
        attributes: ["day_of_week", "open_time", "close_time", "is_closed"],
        required: false,
        separate: true,
      },
      {
        model: Cuisine,
        as: "cuisines",
        attributes: ["cuisine_id", "title", "image"],
        through: { attributes: [] },
        required: Boolean(cuisineId),
        ...(cuisineId ? { where: { cuisine_id: cuisineId } } : {}),
      },
    ],
    subQuery: false,
    distinct: true,
  });

  const restaurantIds = restaurants.map((restaurant) => restaurant.restaurant_id);
  const ratingStats = await Rating.findAll({
    where: { restaurant_id: restaurantIds },
    attributes: [
      "restaurant_id",
      [Sequelize.fn("AVG", Sequelize.col("stars")), "average_rating"],
      [Sequelize.fn("COUNT", Sequelize.col("rating_id")), "rating_count"],
    ],
    group: ["restaurant_id"],
    raw: true,
  });
  const ratingMap = new Map(
    ratingStats.map((stat: any) => [
      stat.restaurant_id,
      {
        averageRating: Number(stat.average_rating) || 0,
        ratingCount: Number(stat.rating_count) || 0,
      },
    ])
  );

  const items = restaurants.map((restaurant) => {
    const primaryAddress = restaurant.getDataValue("addresses")?.[0];
    const restaurantHours = restaurant.getDataValue("hours") ?? [];
    const ratings = ratingMap.get(restaurant.restaurant_id) || { averageRating: 0, ratingCount: 0 };
    const cuisines = restaurant.getDataValue("cuisines") ?? [];

    return {
      restaurantId: restaurant.restaurant_id,
      name: restaurant.name,
      coverImage: restaurant.cover_image,
      deliveryFee: Number(restaurant.delivery_fee),
      minimumOrder: Number(restaurant.minimum_order),
      minDeliveryMinutes: restaurant.min_delivery_minutes,
      maxDeliveryMinutes: restaurant.max_delivery_minutes,
      isOpen: getIsRestaurantOpen(restaurantHours),
      rating: Number(ratings.averageRating.toFixed(1)),
      ratingCount: ratings.ratingCount,
      cuisines: cuisines.map((cuisine: Cuisine): CuisineResponse => ({
        id: cuisine.cuisine_id,
        name: cuisine.title,
        image: cuisine.image ?? "",
      })),
      location: primaryAddress ? {
        city: primaryAddress.city,
        state: primaryAddress.state,
        area: primaryAddress.area,
      } : null,
    };
  });

  const totalPages = Math.ceil(count / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    items,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: count,
      itemsPerPage: limit,
      hasNextPage,
      hasPreviousPage,
      nextPage: hasNextPage ? page + 1 : null,
      previousPage: hasPreviousPage ? page - 1 : null,
    },
  };
};
