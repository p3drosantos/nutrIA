import rateLimit from "express-rate-limit";

type RateLimiterOptions = {
  windowMs: number;
  max: number;
  message: string;
};

export function createRateLimiter({
  windowMs,
  max,
  message,
}: RateLimiterOptions) {
  return rateLimit({
    windowMs,
    max,

    handler: (req, res) => {
      return res.status(429).json({
        error: "TOO_MANY_REQUESTS",
        message,
      });
    },

    standardHeaders: true,
    legacyHeaders: false,
  });
}
