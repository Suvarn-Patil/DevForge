import express from "express";

import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";

import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";

import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/projectValidator";

const router = express.Router();

router.post(
  "/",
  protect,
  validate(createProjectSchema),
  createProject
);

router.get(
  "/",
  protect,
  getProjects
);

router.get(
  "/:id",
  protect,
  getProject
);

router.put(
  "/:id",
  protect,
  validate(updateProjectSchema),
  updateProject
);

router.delete(
  "/:id",
  protect,
  deleteProject
);

export default router;