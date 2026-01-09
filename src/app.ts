import express from "express";
import cors from "cors";
import morgan from "morgan";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import usersRoutes from "./modules/users/user.routes";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import * as openapiDoc from "./docs/openapi.json";

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(cookieParser());

//routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));

app.use(errorHandler);

//health endpoint
app.get("/", (req, res) => {
  res.json({ service: "auth-api", status: "corriendo" });
});

export default app;
