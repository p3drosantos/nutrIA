import { Router } from "express";
import { CreateUserRepository } from "../repositories/user/CreateUserRepository";
import { CreateUserUseCase } from "../use-cases/user/CreateUserUseCase";
import { GetUserByEmailRepository } from "../repositories/user/GetUserByEmailRepository";
import { CreateUserController } from "../controllers/user/CreateUserController";
import { GetUserByIdRepository } from "../repositories/user/GetUserByIdRepository";
import { GetUserByIdUseCase } from "../use-cases/user/GetUserByIdUseCase";
import { GetUserByIdController } from "../controllers/user/GetUserByIdController";
import { authMiddleware } from "../middlewares/auth-middleware";
import { createRateLimiter } from "../middlewares/limiter-middleware";

const router = Router();

const registerRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message:
    "You have exceeded the maximum number of requests. Please try again later.",
});

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retorna dados do usuário autenticado
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserRequest'
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post("/register", registerRateLimit, async (req, res) => {
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
