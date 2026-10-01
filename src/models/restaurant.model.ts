import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";
import { RestaurantStatus } from "../constants.js";

class Restaurant extends Model {
  declare restaurant_id: string;
  declare owner_id: string;
  declare name: string;
  declare description: string | null;
  declare logo: string | null;
  declare cover_image: string | null;
  declare delivery_fee: string;
  declare minimum_order: string;
  declare min_delivery_minutes: number | null;
  declare max_delivery_minutes: number | null;
  declare status: RestaurantStatus;
  declare rejection_reason: string | null;
  declare approved_at: Date | null;
  declare created_at: Date;
  declare updated_at: Date;
}

Restaurant.init(
  {
    restaurant_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cover_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    delivery_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    minimum_order: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    min_delivery_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    max_delivery_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(RestaurantStatus)),
      allowNull: false,
      defaultValue: RestaurantStatus.Pending,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    sequelize: sequelizeInstance,
    tableName: "restaurants",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Restaurant;
