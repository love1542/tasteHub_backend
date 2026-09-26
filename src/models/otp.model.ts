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
    declare send_count: number;
    declare last_sent_at: Date;
    declare rate_limit_reset_at: Date;
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

        send_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },

        last_sent_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        rate_limit_reset_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeInstance,
        tableName: "otps",
        timestamps: false,
    }
)

export default OTP;