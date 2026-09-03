import "./config/env.js";
import app from "./app.js";
import dbConnect from "./config/database.js";

const PORT = Number(process.env.PORT) || 5000;

dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`TasteHub server running on http://localhost:${PORT}`);
  });
}).catch((error:any ) => {
  console.error("Failed to initialize the database:", error);
});