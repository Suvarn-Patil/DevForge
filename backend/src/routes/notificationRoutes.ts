import express from "express";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notificationController";

import {
  protect,
} from "../middleware/authMiddleware";

const router =
  express.Router();

router.get(
  "/",
  protect,
  getNotifications
);

router.patch(
  "/:id/read",
  protect,
  markNotificationRead
);

router.patch(
  "/read-all",
  protect,
  markAllNotificationsRead
);

export default router;
