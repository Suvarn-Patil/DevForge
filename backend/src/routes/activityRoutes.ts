import express from "express";

import {
  getActivities,
} from "../controllers/activityController";

import {
  protect,
} from "../middleware/authMiddleware";

const router =
  express.Router();

router.get(
  "/projects/:projectId/activities",
  protect,
  getActivities
);

export default router;
