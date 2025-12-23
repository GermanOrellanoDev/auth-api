import express from "express";
import cors from "cors";
import morgan from "morgan";
import healthRoutes from "./routes/health.routes";

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api", healthRoutes);

//health endpoint
app.get("/", (req, res) => {
  res.json({ service: "auth-api", status: "corriendo" });
});

export default app;
