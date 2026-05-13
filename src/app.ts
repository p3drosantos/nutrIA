import express from "express";
import userRoutes from "./routes/user.routes";
import dietRoutes from "./routes/diet.routes";
import authRoutes from "./routes/auth.routes";

export const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/diet", dietRoutes);
