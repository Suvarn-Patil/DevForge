import { z } from "zod";

// =========================================
// CREATE TASK
// =========================================

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title is too long"),

    description: z
      .string()
      .trim()
      .max(
        2000,
        "Description is too long"
      )
      .optional(),

    project: z
      .string()
      .min(1, "Project is required"),

    priority: z
      .enum([
        "low",
        "medium",
        "high",
      ])
      .optional(),

    status: z
      .enum([
        "todo",
        "inprogress",
        "review",
        "done",
      ])
      .optional(),

    assignee: z
      .string()
      .min(1, "Invalid assignee")
      .optional(),
  }),
});

// =========================================
// UPDATE TASK
// =========================================

export const updateTaskSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(200, "Title is too long")
        .optional(),

      description: z
        .string()
        .trim()
        .max(
          2000,
          "Description is too long"
        )
        .optional(),

      priority: z
        .enum([
          "low",
          "medium",
          "high",
        ])
        .optional(),

      assignee: z
        .string()
        .min(1, "Invalid assignee")
        .optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          "At least one field is required",
      }
    ),
});

// =========================================
// UPDATE TASK STATUS
// =========================================

export const updateTaskStatusSchema =
  z.object({
    body: z.object({
      status: z.enum([
        "todo",
        "inprogress",
        "review",
        "done",
      ]),
    }),
  });

// =========================================
// TASK QUERY
// =========================================

export const taskQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((value) =>
        value === undefined
          ? undefined
          : Number(value)
      )
      .refine(
        (value) =>
          value === undefined ||
          (Number.isInteger(value) &&
            value >= 1),
        {
          message:
            "Page must be a positive integer",
        }
      ),

    limit: z
      .string()
      .optional()
      .transform((value) =>
        value === undefined
          ? undefined
          : Number(value)
      )
      .refine(
        (value) =>
          value === undefined ||
          (Number.isInteger(value) &&
            value >= 1 &&
            value <= 100),
        {
          message:
            "Limit must be between 1 and 100",
        }
      ),

    status: z
      .enum([
        "todo",
        "inprogress",
        "review",
        "done",
      ])
      .optional(),

    priority: z
      .enum([
        "low",
        "medium",
        "high",
      ])
      .optional(),

    search: z
      .string()
      .trim()
      .optional(),

    sort: z
      .enum([
        "newest",
        "oldest",
        "priority",
      ])
      .optional(),
  }),
});
