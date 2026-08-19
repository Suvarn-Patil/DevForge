import { Request, Response, NextFunction } from "express";

import {
  createProject as createProjectService,
  getProjectsByOwner,
  getProjectById,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
} from "../services/projectService";

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;

    const owner = (req as any).userId;

    const project = await createProjectService(
      name,
      description,
      owner
    );

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = (req as any).userId;

    const projects = await getProjectsByOwner(owner);

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProject = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = (req as any).userId;

    const project = await getProjectById(
      req.params.id,
      owner
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

export const updateProject = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = (req as any).userId;

    const project = await updateProjectService(
      req.params.id,
      owner,
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

export const deleteProject = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = (req as any).userId;

    const project = await deleteProjectService(
      req.params.id,
      owner
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