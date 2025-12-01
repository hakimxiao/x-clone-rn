import { aj } from "../config/arcjet.js";

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    // jika request ditolak
    if (decision.consequence === "deny") {
      switch (decision.reason) {
        case "rate_limit":
          return res.status(429).json({
            error: "Too Many Requests",
            message: "Rate limit exceeded. Please slow down.",
          });

        case "bot":
          return res.status(403).json({
            error: "Bot Blocked",
            message: "Automated request denied.",
          });

        case "spoofed":
          return res.status(403).json({
            error: "Spoofed Client",
            message: "Request appears spoofed or manipulated.",
          });

        case "attack":
          return res.status(403).json({
            error: "Security Threat",
            message: "Request blocked due to security threat.",
          });

        default:
          return res.status(403).json({
            error: "Forbidden",
            message: "Request denied.",
          });
      }
    }

    next();
  } catch (err) {
    console.error("Arcjet middleware error:", err);
    next(); // tetap lanjutkan request jika Arcjet gagal
  }
};
