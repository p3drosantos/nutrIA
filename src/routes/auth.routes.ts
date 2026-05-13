import { Router } from "express";
import { LoginUseCase } from "../use-cases/auth/LoginUseCase";
import { LoginController } from "../controllers/auth/LoginController";
import { GetUserByEmailRepository } from "../repositories/user/GetUserByEmailRepository";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const getUserByEmailRepository = new GetUserByEmailRepository();
    const loginUseCase = new LoginUseCase(getUserByEmailRepository);
    const loginController = new LoginController(loginUseCase);

    const reponse = await loginController.login({ body: req.body });

    res.status(reponse.statusCode).json(reponse.body);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
