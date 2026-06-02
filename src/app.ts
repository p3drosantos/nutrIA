import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import dietRoutes from "./routes/diet.routes";
import authRoutes from "./routes/auth.routes";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

export const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://nutria-web-chi.vercel.app"],
  }),
);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/diet", dietRoutes);
