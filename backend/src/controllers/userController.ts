import {
  Response,
  NextFunction,
} from "express";

import bcrypt from "bcryptjs";

import {
  AuthRequest,
} from "../middleware/authMiddleware";

import User from "../models/User";

import {
  searchUsers as searchUsersService,
} from "../services/userService";

/* ================================
   GET CURRENT USER
================================ */

export const getCurrentUser =
  async (
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

      const user =
        await User.findById(
          req.userId
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

/* ================================
   UPDATE CURRENT USER
================================ */

export const updateCurrentUser =
  async (
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

      const name =
        typeof req.body.name ===
        "string"
          ? req.body.name.trim()
          : "";

      if (!name) {
        return res.status(400).json({
          message: "Name is required",
        });
      }

      const user =
        await User.findByIdAndUpdate(
          req.userId,
          {
            name,
          },
          {
            new: true,
            runValidators: true,
          }
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

/* ================================
   CHANGE PASSWORD
================================ */

export const changePassword =
  async (
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

      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        typeof currentPassword !==
          "string" ||
        typeof newPassword !==
          "string"
      ) {
        return res.status(400).json({
          message:
            "Current password and new password are required",
        });
      }

      if (
        newPassword.length < 6
      ) {
        return res.status(400).json({
          message:
            "New password must be at least 6 characters",
        });
      }

      const user =
        await User.findById(
          req.userId
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const passwordMatches =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!passwordMatches) {
        return res.status(400).json({
          message:
            "Current password is incorrect",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password =
        hashedPassword;

      await user.save();

      res.status(200).json({
        message:
          "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  };

/* ================================
   SEARCH USERS
================================ */

export const searchUsers =
  async (
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
        typeof req.query.search ===
        "string"
          ? req.query.search.trim()
          : "";

      if (!search) {
        return res.json([]);
      }

      const users =
        await searchUsersService(
          search
        );

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };