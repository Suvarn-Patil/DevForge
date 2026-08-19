import {
  Response,
  NextFunction,
} from "express";

import {
  AuthRequest,
} from "../middleware/authMiddleware";

import {
  generateAIResponse,
} from "../services/aiService";

export const chatWithAI = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const message =
      typeof req.body.message === "string"
        ? req.body.message.trim()
        : "";

    if (!message) {
      return res.status(400).json({
        message:
          "Message is required",
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        message:
          "Message is too long",
      });
    }

    const response =
      await generateAIResponse(
        message
      );

    res.status(200).json({
      response,
    });
  } catch (error) {
    console.error(
      "AI request error:",
      error
    );

    next(error);
  }
};
