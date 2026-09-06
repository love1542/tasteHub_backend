import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

class User extends Model {
  declare user_id: string;
  declare role: string;
  declare email: string | null;
  declare password: string | null;
  declare phone: string | null;
  declare full_name: string | null;
  declare image: string | null;
  declare gender: string | null;
  declare date_of_birth: Date | null;
  declare email_verified: boolean;
  declare phone_verified: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    role: {
      type: DataTypes.ENUM("user", "owner"),
      allowNull: false,
      defaultValue: "user",
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },

    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    phone_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: "users",
    timestamps: true,
  }
);

export default User;