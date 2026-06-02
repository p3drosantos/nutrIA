import { Router } from "express";
import { GeminiAdapter } from "../adapters/gemini-adapter";
import { GenerateDietUseCase } from "../use-cases/diet/GenerateDietUseCase";
import { GenerateDietController } from "../controllers/diet/GenerateDietController";
import { GenerateDietRepository } from "../repositories/diet/GenerateDietRepository";
import { GetDietByIdController } from "../controllers/diet/GetDietByIdController";
import { GetDietByIdRepository } from "../repositories/diet/GetDietByIdRepository";
import { GetDietByIdUseCase } from "../use-cases/diet/GetDietByIdUseCase";
import { authMiddleware } from "../middlewares/auth-middleware";
import { GetAllDietsController } from "../controllers/diet/GetAllDietsController";
import { GetAllDietsUseCase } from "../use-cases/diet/GetAllDietsUseCase";
import { GetAllDietsPlansRepository } from "../repositories/diet/GetAllDietsRepository";
import { DeleteDietController } from "../controllers/diet/DeleteDietController";
import { DeleteDietUseCase } from "../use-cases/diet/DeleteDietUseCase";
import { DeleteDietRepository } from "../repositories/diet/DeleteDietRepository";
import { UpdateDietUseCase } from "../use-cases/diet/UpdateDietUseCase";
import { UpdateDietRepository } from "../repositories/diet/UpdateDietRepository";
import { UpdateDietController } from "../controllers/diet/UpdateDietController";
import { createRateLimiter } from "../middlewares/limiter-middleware";
import { AiRequestLogRepository } from "../repositories/ai-request-log/AiRequestLogRepository";

const router = Router();

const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message:
    "You have exceeded the maximum number of requests. Please try again later.",
});

/**
 * @swagger
 * /diet/generate:
 *   post:
 *     summary: Gera um novo plano de dieta
 *     tags:
 *       - Diets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateDietRequest'
 *     responses:
 *       200:
 *         description: Diet plan generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenerateDietResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too many requests
 *       502:
 *         description: Bad Gateway
 *       500:
 *         description: Internal server error
 */
router.post("/generate", authMiddleware, aiRateLimiter, async (req, res) => {
  try {
    const iaProvider = new GeminiAdapter();
    const aiRequestLogRepository = new AiRequestLogRepository();
    const generateDietRepository = new GenerateDietRepository();
    const generateDietUseCase = new GenerateDietUseCase(
      iaProvider,
      generateDietRepository,
      aiRequestLogRepository,
    );
    const generateDietController = new GenerateDietController(
      generateDietUseCase,
    );

    const response = await generateDietController.generateDiet({
      body: req.body,
      userId: req.userId,
    });
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate diet plan" });
  }
});

/**
 * @swagger
 * /diet/my-plans:
 *   get:
 *     summary: Retrieves all diet plans for the authenticated user
 *     tags:
 *       - Diets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of diet plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DietPlanEntity'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/my-plans", authMiddleware, async (req, res) => {
  try {
    const getAllDietsPlansRepository = new GetAllDietsPlansRepository();
    const getAllDietsUseCase = new GetAllDietsUseCase(
      getAllDietsPlansRepository,
    );
    const getAllDietsController = new GetAllDietsController(getAllDietsUseCase);

    const response = await getAllDietsController.getAllDietPlans({
      userId: req.userId,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve diet plans" });
  }
});

/**
 * @swagger
 * /diet/{id}:
 *   get:
 *     summary: Retrieves a specific diet plan by ID
 *     tags:
 *       - Diets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Diet plan found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DietPlanEntity'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Diet plan not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const getDietByIdUseCase = new GetDietByIdUseCase(
      new GetDietByIdRepository(),
    );
    const getDietByIdController = new GetDietByIdController(getDietByIdUseCase);
    const response = await getDietByIdController.getDietPlan({
      params: { id: Number(id) },
      userId: req.userId,
    });
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve diet plan" });
  }
});

/**
 * @swagger
 * /diet/{id}:
 *   delete:
 *     summary: Deletes a specific diet plan by ID
 *     tags:
 *       - Diets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Diet plan deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Diet plan not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDietUseCase = new DeleteDietUseCase(
      new DeleteDietRepository(),
      new GetDietByIdRepository(),
    );
    const deleteDietController = new DeleteDietController(deleteDietUseCase);
    const response = await deleteDietController.deleteDietPlan({
      params: { id: Number(id) },
      userId: req.userId,
    });
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete diet plan" });
  }
});

/**
 * @swagger
 * /diet/{id}:
 *   patch:
 *     summary: Updates a specific diet plan by ID
 *     tags:
 *       - Diets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userRequest
 *             properties:
 *               userRequest:
 *                 type: string
 *                 description: User's request to update the diet plan
 *                 example: "Change the fruit I have for my Monday breakfast. I want to have a banana instead of an apple."
 *     responses:
 *       200:
 *         description: Diet plan updated successfully
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdateDietResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Diet plan not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", authMiddleware, aiRateLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    const updateDietRepository = new UpdateDietRepository();
    const aiRequestLog = new AiRequestLogRepository();
    const getDietByIdRepository = new GetDietByIdRepository();
    const iaProvider = new GeminiAdapter();

    const updateDietUseCase = new UpdateDietUseCase(
      updateDietRepository,
      getDietByIdRepository,
      iaProvider,
      aiRequestLog,
    );

    const updateDietController = new UpdateDietController(updateDietUseCase);
    const response = await updateDietController.updateDiet({
      params: { id: Number(id) },
      body: req.body,
      userId: req.userId,
    });
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update diet plan" });
  }
});

export default router;
