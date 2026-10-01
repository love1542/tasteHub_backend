import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

class RestaurantHour extends Model {
  declare id: string;
  declare restaurant_id: string;
  declare day_of_week: number;
  declare open_time: string;
  declare close_time: string;
  declare is_closed: boolean;
  declare created_at: Date;
  declare updated_at: Date;
}

RestaurantHour.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    restaurant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "restaurants",
        key: "restaurant_id",
      },
    },
    day_of_week: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 6,
      },
    },
    open_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    close_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    is_closed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: "restaurant_hours",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default RestaurantHour;
