import { Router } from "express";
import { LoginUseCase } from "../use-cases/auth/LoginUseCase";
import { LoginController } from "../controllers/auth/LoginController";
import { GetUserByEmailRepository } from "../repositories/user/GetUserByEmailRepository";
import { RefreshTokenUseCase } from "../use-cases/auth/RefreshTokenUseCase";
import { RefreshTokenController } from "../controllers/auth/RefreshTokenController";
import { GetUserByIdRepository } from "../repositories/user/GetUserByIdRepository";
import { createRateLimiter } from "../middlewares/limiter-middleware";

const router = Router();

const loginRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 8,
  message:
    "You have exceeded the maximum number of requests. Please try again later.",
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: Jhon@example.com
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input data
 *       429:
 *         description: Too many requests
 */
router.post("/login", loginRateLimiter, async (req, res) => {
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

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Atualiza o token de acesso usando o token de refresh
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de refresh
 *                 example: refresh.token.exemplo
 *     responses:
 *       200:
 *         description: Successful token refresh
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *       400:
 *         description: Invalid input data
 */
router.post("/refresh", async (req, res) => {
  try {
    const getUserByIdRepository = new GetUserByIdRepository(); // Assuming this repository can also get user by ID
    const refreshTokenUseCase = new RefreshTokenUseCase(getUserByIdRepository);
    const refreshTokenController = new RefreshTokenController(
      refreshTokenUseCase,
    );

    const response = await refreshTokenController.refreshToken({
      body: req.body,
    });

    res.status(response.statusCode).json(response.body);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
