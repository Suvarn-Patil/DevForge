import { Response, NextFunction } from "express";

import { AuthRequest } from "./authMiddleware";

import { getTeamMember } from "../services/teamService";

type TeamRole =
  | "owner"
  | "admin"
  | "member"
  | "viewer";

export const requireTeamRole = (
  ...allowedRoles: TeamRole[]
) => {
  return async (
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

      const teamId = req.params.id as string;

      const membership = await getTeamMember(
        teamId,
        req.userId
      );

      if (!membership) {
        return res.status(403).json({
          message: "You are not a member of this team",
        });
      }

      if (!allowedRoles.includes(
        membership.role as TeamRole
      )) {
        return res.status(403).json({
          message: "Insufficient permissions",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};