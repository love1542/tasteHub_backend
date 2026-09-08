import { Sequelize } from "sequelize";
import { env } from "./env.js";

export const sequelizeInstance = new Sequelize(
  env.database.name,
  env.database.user,
  env.database.password,
  {
    dialect: "postgres",
    host: env.database.host,
    port: env.database.port,
  }
);

const dbConnect = async () => {
  try {
    await sequelizeInstance.authenticate();
    console.log("Database connection established successfully.");
  } catch (error:any) {
    console.error("Unable to connect to the database:", error);
  }
};

export default dbConnect;