import { Router } from "express";
import { prisma } from "../lib/prisma";
import { CreateUserRepository } from "../repositories/user/CreateUserRepository";
import { CreateUserUseCase } from "../use-cases/user/CreateUserUseCase";
import { GetUserByEmailRepository } from "../repositories/user/GetUserByEmailRepository";
import { CreateUserController } from "../controllers/user/CreateUserController";

const router = Router();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  return res.json(users);
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
