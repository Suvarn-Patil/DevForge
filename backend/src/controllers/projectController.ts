import { Response, NextFunction } from "express";

import {
  createProject as createProjectService,
  getProjectsByOwner,
  getProjectById,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
} from "../services/projectService";

import { AuthRequest } from "../middleware/authMiddleware";

/* ================================
   CREATE PROJECT
================================ */

export const createProject = async (
  req: AuthRequest & { params: { id: string } },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { name, description } = req.body;

    const project = await createProjectService(
      name,
      description,
      req.userId
    );

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

/* ================================
   GET PROJECTS
================================ */

export const getProjects = async (
  req: AuthRequest & { params: { id: string } },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const projects =
      await getProjectsByOwner(req.userId);

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

/* ================================
   GET PROJECT
================================ */

export const getProject = async (
  req: AuthRequest & { params: { id: string } },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const project = await getProjectById(
      req.params.id,
      req.userId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

/* ================================
   UPDATE PROJECT
================================ */

export const updateProject = async (
  req: AuthRequest & { params: { id: string } },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const project =
      await updateProjectService(
        req.params.id,
        req.userId,
        req.body
      );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

/* ================================
   DELETE PROJECT
================================ */

export const deleteProject = async (
  req: AuthRequest & { params: { id: string } },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const project =
      await deleteProjectService(
        req.params.id,
        req.userId
      );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
