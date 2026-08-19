import { Response } from "express";

import Task from "../models/Task";

import {
  AuthRequest,
} from "../middleware/authMiddleware";

import {
  createActivity,
} from "../services/activityService";

/* ================================
   CREATE TASK
================================ */

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

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      priority,
      status,
      owner: req.userId,
      assignee: assignee || null,
    });

    /* CREATE ACTIVITY */

    await createActivity(
      project,
      req.userId,
      "created_task",
      `Created task "${title}"`,
      task._id.toString()
    );

    const populatedTask =
      await Task.findById(task._id)
        .populate(
          "assignee",
          "name email"
        )
        .populate(
          "project",
          "name"
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

/* ================================
   GET ALL TASKS
================================ */

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
          "name"
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
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      title,
      description,
      priority,
      assignee,
    } = req.body;

    const existingTask =
      await Task.findOne({
        _id: req.params.id,
        owner: req.userId,
      });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const updates: {
      title?: string;
      description?: string;
      priority?: "low" | "medium" | "high";
      assignee?: string | null;
    } = {};

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

    /* CREATE ACTIVITY */

    await createActivity(
      existingTask.project.toString(),
      req.userId,
      "updated_task",
      `Updated task "${task.title}"`,
      task._id.toString()
    );

    res.status(200).json(
      task
    );
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
      if (!req.userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const {
        status,
      } = req.body;

      const existingTask =
        await Task.findOne({
          _id: req.params.id,
          owner: req.userId,
        });

      if (!existingTask) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

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

      /* CREATE ACTIVITY */

      const statusNames: Record<
        string,
        string
      > = {
        todo: "Todo",
        inprogress:
          "In Progress",
        review: "Review",
        done: "Done",
      };

      const statusLabel =
        statusNames[status] ||
        status;

      await createActivity(
        existingTask.project.toString(),
        req.userId,
        "changed_status",
        `Moved task "${task.title}" to ${statusLabel}`,
        task._id.toString()
      );

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
    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const task =
      await Task.findOne({
        _id: req.params.id,
        owner: req.userId,
      });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const taskTitle =
      task.title;

    const projectId =
      task.project.toString();

    const taskId =
      task._id.toString();

    await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    /* CREATE ACTIVITY */

    await createActivity(
      projectId,
      req.userId,
      "deleted_task",
      `Deleted task "${taskTitle}"`,
      taskId
    );

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
