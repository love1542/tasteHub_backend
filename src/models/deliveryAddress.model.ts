import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../config/database.js";

export type AddressLabel = "home" | "work" | "other";

class DeliveryAddress extends Model {
  declare id: string;
  declare userId: string;
  declare label: AddressLabel;
  declare receiverName: string;
  declare receiverPhone: string;
  declare addressLine: string;
  declare area: string | null;
  declare landmark: string | null;
  declare city: string;
  declare state: string;
  declare postalCode: string;
  declare latitude: number;
  declare longitude: number;
  declare isDefault: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

DeliveryAddress.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    label: {
      type: DataTypes.ENUM("home", "work", "other"),
      allowNull: false,
    },
    receiverName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    landmark: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: "delivery_addresses",
    timestamps: true,
    underscored: true,
  }
);

export default DeliveryAddress;