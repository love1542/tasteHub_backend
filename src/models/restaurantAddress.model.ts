import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

class RestaurantAddress extends Model {
  declare address_id: string;
  declare restaurant_id: string;
  declare address_line: string;
  declare area: string | null;
  declare landmark: string | null;
  declare city: string;
  declare state: string;
  declare postal_code: string;
  declare latitude: number ;
  declare longitude: number;
  declare created_at: Date;
  declare updated_at: Date;
}

RestaurantAddress.init(
  {
    address_id: {
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
    address_line: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    landmark: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      },
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      },
    }
  },
  {
    sequelize: sequelizeInstance,
    tableName: "restaurant_addresses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default RestaurantAddress;
