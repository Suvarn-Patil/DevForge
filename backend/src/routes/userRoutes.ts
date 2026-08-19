import express from "express";

import {
  getCurrentUser,
  updateCurrentUser,
  changePassword,
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
   PASSWORD
================================ */

router.patch(
  "/me/password",
  protect,
  changePassword
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