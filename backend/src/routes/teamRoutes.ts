import express from "express";

import {
  createTeam,
  getTeams,
  getTeam,
  addMember,
  updateMember,
  removeMember,
} from "../controllers/teamController";

import { protect } from "../middleware/authMiddleware";

import { requireTeamRole } from "../middleware/teamAuthMiddleware";

import { validate } from "../middleware/validateMiddleware";

import {
  createTeamSchema,
  addTeamMemberSchema,
  updateMemberRoleSchema,
} from "../validators/teamValidator";

const router = express.Router();

router.post(
  "/",
  protect,
  validate(createTeamSchema),
  createTeam
);

router.get(
  "/",
  protect,
  getTeams
);

router.get(
  "/:id",
  protect,
  getTeam
);

router.post(
  "/:id/members",
  protect,
  requireTeamRole("owner", "admin"),
  validate(addTeamMemberSchema),
  addMember
);

router.put(
  "/:id/members/:userId",
  protect,
  requireTeamRole("owner", "admin"),
  validate(updateMemberRoleSchema),
  updateMember
);

router.delete(
  "/:id/members/:userId",
  protect,
  requireTeamRole("owner", "admin"),
  removeMember
);

export default router;