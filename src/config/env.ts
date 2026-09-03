import dotenv from "dotenv";

const environment = process.env.NODE_ENV || "development";

const envFile = environment === "test" ? ".env.test" : ".env";

dotenv.config({
  path: envFile,
});

export const env = {
  nodeEnv: environment,

  port: Number(process.env.PORT) || 5000,

  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
  },

  jwtSecret: process.env.JWT_SECRET || "",
};