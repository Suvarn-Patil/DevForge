import { Response } from "express";

import Project from "../models/Project";
import Task from "../models/Task";

import { AuthRequest } from "../middleware/authMiddleware";

export const createProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.userId,
    });

    res.status(201).json(project);
  } catch {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getProjects = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projects = await Project.find({
      owner: req.userId,
    });

    res.json(projects);
  } catch {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getProjectTasks = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tasks = await Task.find({
      project: req.params.id,
      owner: req.userId,
    });

    res.json(tasks);
  } catch {
    res.status(500).json({
      message: "Server Error",
    });
  }
};