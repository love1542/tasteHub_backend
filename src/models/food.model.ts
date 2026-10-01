import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

class Food extends Model {
  declare food_id: string;
  declare restaurant_id: string;
  declare category_id: string;
  declare name: string;
  declare description: string ;
  declare image: string ;
  declare price: string;
  declare discount_price: string | null;
  declare preparation_time_minutes: number | null;
  declare food_type: "veg" | "non_veg" ;
  declare is_available: boolean;
  declare created_at: Date;
  declare updated_at: Date;
}

Food.init(
  {
    food_id: {
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
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "menu_categories",
        key: "category_id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    discount_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    preparation_time_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    food_type: {
      type: DataTypes.ENUM("veg", "non_veg", "egg"),
      allowNull: false,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: "foods",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["restaurant_id", "category_id", "name"],
      },
    ],
  }
);

export default Food;
