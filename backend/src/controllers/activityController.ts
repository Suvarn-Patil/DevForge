import {
  Response,
  NextFunction,
} from "express";

import {
  AuthRequest,
} from "../middleware/authMiddleware";

import {
  getProjectActivities,
} from "../services/activityService";

import Project from "../models/Project";

export const getActivities =
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

      const projectId =
        req.params.projectId as string;

      const project =
        await Project.findOne({
          _id: projectId,
          owner: req.userId,
        });

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      const activities =
        await getProjectActivities(
          projectId
        );

      res.status(200).json(
        activities
      );
    } catch (error) {
      next(error);
    }
  };
