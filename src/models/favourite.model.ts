import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

class Favourite extends Model {
  declare user_id: string;
  declare restaurant_id: string;
}

Favourite.init(
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    restaurant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "restaurants",
        key: "restaurant_id",
      },
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: "favourites",
    timestamps: false,
  }
);

export default Favourite;
