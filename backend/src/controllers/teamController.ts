import { Response, NextFunction } from "express";

import { AuthRequest } from "../middleware/authMiddleware";

import {
  createTeam as createTeamService,
  getTeamsForUser,
  getTeamById,
  addTeamMember,
  updateMemberRole,
  removeTeamMember,
} from "../services/teamService";

type TeamRole =
  | "owner"
  | "admin"
  | "member"
  | "viewer";

export const createTeam = async (
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

    const { name } = req.body;

    const team = await createTeamService(
      name,
      req.userId
    );

    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

export const getTeams = async (
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

    const teams = await getTeamsForUser(
      req.userId
    );

    res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
};

export const getTeam = async (
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

    const result = await getTeamById(
      req.params.id as string,
      req.userId
    );

    if (!result) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const addMember = async (
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

    const { userId, role } = req.body;

    const membership = await addTeamMember(
      req.params.id as string,
      userId,
      role as TeamRole
    );

    if (!membership) {
      return res.status(409).json({
        message: "User is already a team member",
      });
    }

    res.status(201).json(membership);
  } catch (error) {
    next(error);
  }
};

export const updateMember = async (
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

    const { role } = req.body;

    const membership =
      await updateMemberRole(
        req.params.id as string,
        req.params.userId as string,
        role as TeamRole
      );

    if (!membership) {
      return res.status(404).json({
        message: "Team member not found",
      });
    }

    res.status(200).json(membership);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (
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

    const membership =
      await removeTeamMember(
        req.params.id as string,
        req.params.userId as string
      );

    if (!membership) {
      return res.status(404).json({
        message: "Team member not found",
      });
    }

    res.status(200).json({
      message: "Member removed successfully",
    });
  } catch (error) {
    next(error);
  }
};