import express from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController";

import {
  protect,
} from "../middleware/authMiddleware";

const router =
  express.Router();

/* CREATE TASK */

router.post(
  "/",
  protect,
  createTask
);

/* GET ALL TASKS */

router.get(
  "/",
  protect,
  getTasks
);

/* GET SINGLE TASK */

router.get(
  "/:id",
  protect,
  getTaskById
);

/* EDIT TASK */

router.patch(
  "/:id",
  protect,
  updateTask
);

/* UPDATE STATUS */

router.patch(
  "/:id/status",
  protect,
  updateTaskStatus
);

/* DELETE TASK */

router.delete(
  "/:id",
  protect,
  deleteTask
);

export default router;