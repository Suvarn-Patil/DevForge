import { Response, NextFunction } from "express";

import {
  AuthRequest,
} from "../middleware/authMiddleware";

import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationService";

export const getNotifications = async (
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

    const unread =
      req.query.unread === "true";

    const notifications =
      await getUserNotifications(
        req.userId,
        unread
      );

    res.status(200).json(
      notifications
    );
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead =
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

      const notification =
        await markNotificationAsRead(
          req.params.id as string,
          req.userId
        );

      if (!notification) {
        return res.status(404).json({
          message:
            "Notification not found",
        });
      }

      res.status(200).json(
        notification
      );
    } catch (error) {
      next(error);
    }
  };

export const markAllNotificationsRead =
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

      const result =
        await markAllNotificationsAsRead(
          req.userId
        );

      res.status(200).json({
        message:
          "All notifications marked as read",
        modifiedCount:
          result.modifiedCount,
      });
    } catch (error) {
      next(error);
    }
  };
