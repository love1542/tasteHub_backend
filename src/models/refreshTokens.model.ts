import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

class REFRESH_TOKENS extends Model {
    declare token_id: string;
    declare user_id: string;
    declare refresh_token: string;
    declare device_id: string;
    declare expires_at: Date;
    declare created_at: Date;
}

REFRESH_TOKENS.init(
    {
        token_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },

        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        refresh_token: {
            type: DataTypes.STRING,
            allowNull: false
        },

        device_id: {
            type: DataTypes.STRING,
            allowNull: false
        },

        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize: sequelizeInstance,
        tableName: "refresh_tokens",
        timestamps: false
    }
);

export default REFRESH_TOKENS;