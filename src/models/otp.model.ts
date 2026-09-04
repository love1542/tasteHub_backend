import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

class OTP extends Model {
  declare otp_id: string;
  declare user_id: string;
  declare otp_code: string;
  declare purpose: string;
  declare attempts: number;
  declare expiration_time: Date;
  declare createdAt: Date;
}

OTP.init(
    {
        otp_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        otp_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        purpose: {
            type: DataTypes.ENUM("login", "reset_password", "sign_up"),
            allowNull: false,
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        expiration_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "otps",
        timestamps: true,
    }
)