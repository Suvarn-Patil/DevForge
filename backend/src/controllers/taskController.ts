import { Response } from "express";

import Task from "../models/Task";

import {
  AuthRequest,
} from "../middleware/authMiddleware";

export const createTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      project,
      priority,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      project,
      priority,
      owner: req.userId,
    });

    res.status(201).json(task);
  } catch {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getTasks = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tasks = await Task.find({
      owner: req.userId,
    });

    res.json(tasks);
  } catch {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateTaskStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(task);
  } catch {
    res.status(500).json({
      message: "Server Error",
    });
  }
};