import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Team name is required")
    .max(100, "Team name cannot exceed 100 characters"),
});

export const addTeamMemberSchema = z.object({
  userId: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid user ID"
    ),

  role: z.enum([
    "admin",
    "member",
    "viewer",
  ]),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum([
    "admin",
    "member",
    "viewer",
  ]),
});