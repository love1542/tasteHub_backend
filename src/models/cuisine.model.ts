import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

export type CuisineResponse = {
  id: string;
  name: string;
  image: string;
};

class Cuisine extends Model {
  declare cuisine_id: string;
  declare title: string;
  declare image: string | null;
  declare created_at: Date;
  declare updated_at: Date;
}

Cuisine.init(
  {
    cuisine_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: "cuisines",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Cuisine;
