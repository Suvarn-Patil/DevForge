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
        typeof req.body.name === "string"
          ? req.body.name.trim()
          : "";

      const email =
        typeof req.body.email === "string"
          ? req.body.email.trim().toLowerCase()
          : "";

      if (!name) {
        return res.status(400).json({
          message: "Name is required",
        });
      }

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Please enter a valid email address",
        });
      }

      const existingUser =
        await User.findOne({
          email,
          _id: {
            $ne: req.userId,
          },
        });

      if (existingUser) {
        return res.status(400).json({
          message:
            "An account with this email already exists",
        });
      }

      const user =
        await User.findByIdAndUpdate(
          req.userId,
          {
            name,
            email,
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

      if (
        currentPassword ===
        newPassword
      ) {
        return res.status(400).json({
          message:
            "New password must be different from current password",
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
