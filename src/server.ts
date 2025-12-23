import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/database";

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI no está definido en .env");
  process.exit(1);
}

async function startServer() {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error iniciando la aplicación: ", error);
    process.exit(1);
  }
}

startServer();
