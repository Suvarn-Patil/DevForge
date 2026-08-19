import express from "express";

import {
  getCurrentUser,
  updateCurrentUser,
  searchUsers,
} from "../controllers/userController";

import {
  protect,
} from "../middleware/authMiddleware";

const router =
  express.Router();

/* ================================
   CURRENT USER
================================ */

router.get(
  "/me",
  protect,
  getCurrentUser
);

router.patch(
  "/me",
  protect,
  updateCurrentUser
);

/* ================================
   SEARCH USERS
================================ */

router.get(
  "/search",
  protect,
  searchUsers
);

export default router;