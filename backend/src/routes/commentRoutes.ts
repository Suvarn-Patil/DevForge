import express from "express";

import {
  createComment,
  getComments,
} from "../controllers/commentController";

import {
  updateComment,
  deleteComment,
} from "../controllers/commentController";

import { protect } from "../middleware/authMiddleware";

import { validate } from "../middleware/validateMiddleware";

import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/commentValidator";

const router =
  express.Router();

router.post(
  "/tasks/:taskId/comments",
  protect,
  validate(createCommentSchema),
  createComment
);

router.get(
  "/tasks/:taskId/comments",
  protect,
  getComments
);

router.put(
  "/comments/:id",
  protect,
  validate(updateCommentSchema),
  updateComment
);

router.delete(
  "/comments/:id",
  protect,
  deleteComment
);

export default router;
