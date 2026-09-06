import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

class OTP extends Model {
  declare otp_id: string;
  declare user_id: string;
  declare otp_code: string;
  declare purpose: string;
  declare attempts: number;
  declare expiras_at: Date;
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
            type: DataTypes.ENUM("login_email", "login_phone", "reset_password", "register_email", "register_phone"),
            allowNull: false,
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        expiras_at: {
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

export default OTP;