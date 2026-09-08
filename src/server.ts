import "./config/env.js";

import app from "./app.js";
import dbConnect from "./config/database.js";
import initCloudinary from "./config/cloudinary.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    initCloudinary();

    await dbConnect();

    app.listen(env.port, () => {
      console.log(
        `TasteHub server running on http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("Failed to start TasteHub server:", error);
    process.exit(1);
  }
};

startServer();