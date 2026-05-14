import { Router } from "express";
import { GeminiAdapter } from "../adapters/gemini-adapter";
import { GenerateDietUseCase } from "../use-cases/diet/GenerateDietUseCase";
import { GenerateDietController } from "../controllers/diet/GenerateDietController";
import { GenerateDietRepository } from "../repositories/diet/GenerateDietRepository";
import { GetDietByIdController } from "../controllers/diet/GetDietByIdController";
import { GetDietByIdRepository } from "../repositories/diet/GetDietByIdRepository";
import { GetDietByIdUseCase } from "../use-cases/diet/GetDietByIdUseCase";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const iaProvider = new GeminiAdapter();
    const generateDietRepository = new GenerateDietRepository();
    const generateDietUseCase = new GenerateDietUseCase(
      iaProvider,
      generateDietRepository,
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

export default router;
