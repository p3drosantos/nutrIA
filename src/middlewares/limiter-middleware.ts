import rateLimit from "express-rate-limit";

// Criamos o limitador direto. Ele já é o middleware pronto!
export const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1,
  handler: (req, res) => {
    return res.status(429).json({
      error:
        "Calma lá! Você está fazendo muitas solicitações à IA seguidas. Aguarde 1 minuto.",
    });
  },

  standardHeaders: true,
  legacyHeaders: false,
});
