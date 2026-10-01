import User from "./user.model.js";
import Restaurant from "./restaurant.model.js";
import RestaurantAddress from "./restaurantAddress.model.js";
import RestaurantHour from "./restaurantHour.model.js";
import Cuisine from "./cuisine.model.js";
import RestaurantCuisine from "./restaurantCuisine.model.js";
import MenuCategory from "./menuCategory.model.js";
import Food from "./food.model.js";
import Favourite from "./favourite.model.js";
import Rating from "./rating.model.js";

User.hasMany(Restaurant, {
  foreignKey: "owner_id",
  as: "owned_restaurants",
});
Restaurant.belongsTo(User, {
  foreignKey: "owner_id",
  as: "owner",
});

Restaurant.hasMany(RestaurantAddress, {
  foreignKey: "restaurant_id",
  as: "addresses",
});
RestaurantAddress.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});

Restaurant.hasMany(RestaurantHour, {
  foreignKey: "restaurant_id",
  as: "hours",
});
RestaurantHour.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});

Restaurant.belongsToMany(Cuisine, {
  through: RestaurantCuisine,
  foreignKey: "restaurant_id",
  otherKey: "cuisine_id",
  as: "cuisines",
});
Cuisine.belongsToMany(Restaurant, {
  through: RestaurantCuisine,
  foreignKey: "cuisine_id",
  otherKey: "restaurant_id",
  as: "restaurants",
});

Restaurant.hasMany(MenuCategory, {
  foreignKey: "restaurant_id",
  as: "menu_categories",
});
MenuCategory.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});

Restaurant.hasMany(Food, {
  foreignKey: "restaurant_id",
  as: "foods",
});
Food.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});

MenuCategory.hasMany(Food, {
  foreignKey: "category_id",
  as: "foods",
});
Food.belongsTo(MenuCategory, {
  foreignKey: "category_id",
  as: "category",
});

User.belongsToMany(Restaurant, {
  through: Favourite,
  foreignKey: "user_id",
  otherKey: "restaurant_id",
  as: "favorite_restaurants",
});
Restaurant.belongsToMany(User, {
  through: Favourite,
  foreignKey: "restaurant_id",
  otherKey: "user_id",
  as: "favorited_by_users",
});

User.belongsToMany(Restaurant, {
  through: Rating,
  foreignKey: "user_id",
  otherKey: "restaurant_id",
  as: "rated_restaurants",
});
Restaurant.belongsToMany(User, {
  through: Rating,
  foreignKey: "restaurant_id",
  otherKey: "user_id",
  as: "reviewed_by_users",
});

User.hasMany(Restaurant, {
  foreignKey: "approved_by",
  as: "approved_restaurants",
});
Restaurant.belongsTo(User, {
  foreignKey: "approved_by",
  as: "approver",
});

export {
  User,
  Restaurant,
  RestaurantAddress,
  RestaurantHour,
  Cuisine,
  RestaurantCuisine,
  MenuCategory,
  Food,
  Favourite,
  Rating,
};
