import { Router } from "express";
import { prisma } from "../lib/prisma";
import { CreateUserRepository } from "../repositories/user/CreateUserRepository";
import { CreateUserUseCase } from "../use-cases/user/CreateUserUseCase";
import { GetUserByEmailRepository } from "../repositories/user/GetUserByEmailRepository";
import { CreateUserController } from "../controllers/user/CreateUserController";
import { GetUserByIdRepository } from "../repositories/user/GetUserByIdRepository";
import { GetUserByIdUseCase } from "../use-cases/user/GetUserByIdUseCase";
import { GetUserByIdController } from "../controllers/user/GetUserByIdController";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  return res.json(users);
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const getUserByIdRepository = new GetUserByIdRepository();
    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

    const response = await getUserByIdController.getUserById({
      userId: req.userId,
    });
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const createUserRepository = new CreateUserRepository();
    const getUserByEmailRepository = new GetUserByEmailRepository();
    const createUserUseCase = new CreateUserUseCase(
      createUserRepository,
      getUserByEmailRepository,
    );
    const createUserController = new CreateUserController(createUserUseCase);

    const response = await createUserController.create({
      body: req.body,
    });
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
