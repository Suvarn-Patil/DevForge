import { Response, NextFunction } from "express";

import { AuthRequest } from "../middleware/authMiddleware";

import { searchUsers as searchUsersService } from "../services/userService";

export const searchUsers = async (
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

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    if (!search) {
      return res.json([]);
    }

    const users =
      await searchUsersService(search);

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};