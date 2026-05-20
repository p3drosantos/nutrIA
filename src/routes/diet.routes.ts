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

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateDietRepository = new UpdateDietRepository();
    const getDietByIdRepository = new GetDietByIdRepository();
    const iaProvider = new GeminiAdapter();

    const updateDietUseCase = new UpdateDietUseCase(
      updateDietRepository,
      getDietByIdRepository,
      iaProvider,
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
    res.status(500).json({ error: "Failed to delete diet plan" });
  }
});

export default router;
