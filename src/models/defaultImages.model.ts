import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

class DEFAULT_IMAGES extends Model {
    declare id: string;
    declare name: string;
    declare imageUrl: string;
    declare isActive: boolean;
}

DEFAULT_IMAGES.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize: sequelizeInstance,
    tableName: "defaultImage"

}
)