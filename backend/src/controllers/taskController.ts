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
      status,
      assignee,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      project,
      priority,
      status,
      owner: req.userId,
      assignee: assignee || null,
    });

    const populatedTask =
      await Task.findById(task._id)
        .populate(
          "assignee",
          "name email"
        );

    res.status(201).json(
      populatedTask
    );
  } catch (error) {
    console.error(
      "Create task error:",
      error
    );

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
    const tasks =
      await Task.find({
        owner: req.userId,
      })
        .populate(
          "assignee",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.json(tasks);
  } catch (error) {
    console.error(
      "Get tasks error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ================================
   GET TASK BY ID
================================ */

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
          "name"
        );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    console.error(
      "Get task by ID error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ================================
   UPDATE TASK
================================ */

export const updateTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      priority,
      assignee,
    } = req.body;

    const updates: any = {};

    if (title !== undefined) {
      updates.title = title;
    }

    if (description !== undefined) {
      updates.description =
        description;
    }

    if (priority !== undefined) {
      updates.priority = priority;
    }

    if (assignee !== undefined) {
      updates.assignee =
        assignee || null;
    }

    const task =
      await Task.findOneAndUpdate(
        {
          _id: req.params.id,
          owner: req.userId,
        },
        updates,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "assignee",
          "name email"
        )
        .populate(
          "project",
          "name"
        );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(
      "Update task error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ================================
   UPDATE TASK STATUS
================================ */

export const updateTaskStatus =
  async (
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
            runValidators: true,
          }
        )
          .populate(
            "assignee",
            "name email"
          )
          .populate(
            "project",
            "name"
          );

      if (!task) {
        return res.status(404).json({
          message:
            "Task not found",
        });
      }

      res.json(task);
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      res.status(500).json({
        message: "Server Error",
      });
    }
  };

/* ================================
   DELETE TASK
================================ */

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
    console.error(
      "Delete task error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};