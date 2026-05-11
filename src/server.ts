import express from "express";
import userRoutes from "./routes/user.routes";
import dietRoutes from "./routes/diet.routes";

const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/diet", dietRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
