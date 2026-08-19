import {
  Response,
  NextFunction,
} from "express";

import { AuthRequest } from "../middleware/authMiddleware";

import {
  createComment as createCommentService,
  getTaskComments,
  updateComment as updateCommentService,
  deleteComment as deleteCommentService,
} from "../services/commentService";

export const createComment =
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

      const comment =
        await createCommentService(
          req.params.taskId as string,
          req.userId,
          req.body.text
        );

      if (!comment) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      const populated =
        await comment.populate(
          "user",
          "name email"
        );

      res.status(201).json(
        populated
      );
    } catch (error) {
      next(error);
    }
  };

export const getComments =
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

      const comments =
        await getTaskComments(
          req.params.taskId as string,
          req.userId
        );

      if (comments === null) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      res.status(200).json(
        comments
      );
    } catch (error) {
      next(error);
    }
  };

export const updateComment =
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

      const comment =
        await updateCommentService(
          req.params.id as string,
          req.userId,
          req.body.text
        );

      if (!comment) {
        return res.status(404).json({
          message:
            "Comment not found",
        });
      }

      res.status(200).json(
        comment
      );
    } catch (error) {
      next(error);
    }
  };

export const deleteComment =
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

      const comment =
        await deleteCommentService(
          req.params.id as string,
          req.userId
        );

      if (!comment) {
        return res.status(404).json({
          message:
            "Comment not found",
        });
      }

      res.status(200).json({
        message:
          "Comment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
