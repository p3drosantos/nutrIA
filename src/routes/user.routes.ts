import { Router } from "express";
import { prisma } from "../lib/prisma";
import { GeminiAdapter } from "../adapters/gemini-adapter";

const router = Router();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  return res.json(users);
});

router.post("/", async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });
  return res.json(user);
});

export default router;
