import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

class Rating extends Model {
  declare rating_id: string;
  declare user_id: string;
  declare restaurant_id: string;
  declare stars: number;
  declare review: string | null;
  declare created_at: Date;
  declare updated_at: Date;
}

Rating.init(
  {
    rating_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    restaurant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "restaurants",
        key: "restaurant_id",
      },
    },
    stars: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: "ratings",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["user_id", "restaurant_id"],
      },
    ],
  }
);

export default Rating;
