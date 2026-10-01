import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

class MenuCategory extends Model {
  declare category_id: string;
  declare restaurant_id: string;
  declare title: string;
  declare description: string | null;
  declare image: string | null;
  declare is_active: boolean;
  declare created_at: Date;
  declare updated_at: Date;
}

MenuCategory.init(
  {
    category_id: {
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: "menu_categories",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["restaurant_id", "title"],
      },
    ],
  }
);

export default MenuCategory;
