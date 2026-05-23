import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import dietRoutes from "./routes/diet.routes";
import authRoutes from "./routes/auth.routes";

export const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/diet", dietRoutes);
