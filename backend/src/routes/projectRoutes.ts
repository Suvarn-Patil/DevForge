import express from "express";

import {
  createProject,
  getProjects,
  getProjectTasks,
} from "../controllers/projectController";

import {
  protect,
} from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  createProject
);

router.get(
  "/",
  protect,
  getProjects
);

router.get(
  "/:id/tasks",
  protect,
  getProjectTasks
);

export default router;