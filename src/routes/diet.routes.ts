import { Router } from "express";
import { GeminiAdapter } from "../adapters/gemini-adapter";
import { GenerateDietUseCase } from "../use-cases/GenerateDietUseCase";
import { GenerateDietController } from "../controllers/diet/GenerateDietController";

const router = Router();

router.post("/generate", async (req, res) => {
  try {
    const iaProvider = new GeminiAdapter();
    const generateDietUseCase = new GenerateDietUseCase(iaProvider);
    const generateDietController = new GenerateDietController(
      generateDietUseCase,
    );

    const response = await generateDietController.generateDiet(req.body);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate diet plan" });
  }
});

export default router;
