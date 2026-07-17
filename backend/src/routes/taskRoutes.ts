import express from "express";

import {
  createTask,
  getTasks,
  updateTaskStatus,
} from "../controllers/taskController";

import {
  protect,
} from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  createTask
);

router.get(
  "/",
  protect,
  getTasks
);

router.patch(
  "/:id",
  protect,
  updateTaskStatus
);

export default router;