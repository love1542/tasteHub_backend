import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

class RestaurantCuisine extends Model {
  declare restaurant_id: string;
  declare cuisine_id: string;
}

RestaurantCuisine.init(
  {
    restaurant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "restaurants",
        key: "restaurant_id",
      },
    },
    cuisine_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "cuisines",
        key: "cuisine_id",
      },
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: "restaurant_cuisines",
    timestamps: false,
  }
);

export default RestaurantCuisine;
