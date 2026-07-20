import express from "express";

import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
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

router.delete(
  "/:id",
  protect,
  deleteTask
);

export default router;