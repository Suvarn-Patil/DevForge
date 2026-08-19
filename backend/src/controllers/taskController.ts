import { Response } from "express";

import Task from "../models/Task";

import {
  AuthRequest,
} from "../middleware/authMiddleware";

// =========================================
// CREATE TASK
// =========================================

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
      assignee,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      project,
      priority,
      owner: req.userId,
      assignee: assignee || null,
    });

    const populatedTask =
      await Task.findById(task._id)
        .populate(
          "assignee",
          "name email"
        )
        .populate(
          "project",
          "name description"
        );

    res.status(201).json(
      populatedTask
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =========================================
// GET TASKS
// =========================================

export const getTasks = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tasks =
      await Task.find({
        owner: req.userId,
      })
        .populate(
          "assignee",
          "name email"
        )
        .populate(
          "project",
          "name description"
        )
        .sort({
          createdAt: -1,
        });

    res.json(tasks);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =========================================
// GET TASK BY ID
// =========================================

export const getTaskById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const task =
      await Task.findOne({
        _id: req.params.id,
        owner: req.userId,
      })
        .populate(
          "assignee",
          "name email"
        )
        .populate(
          "project",
          "name description"
        );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =========================================
// UPDATE TASK STATUS
// =========================================

export const updateTaskStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { status } =
      req.body;

    const task =
      await Task.findOneAndUpdate(
        {
          _id: req.params.id,
          owner: req.userId,
        },
        {
          status,
        },
        {
          new: true,
        }
      )
        .populate(
          "assignee",
          "name email"
        )
        .populate(
          "project",
          "name description"
        );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// =========================================
// DELETE TASK
// =========================================

export const deleteTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const task =
      await Task.findOneAndDelete({
        _id: req.params.id,
        owner: req.userId,
      });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
