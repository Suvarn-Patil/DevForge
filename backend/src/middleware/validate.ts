import {
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodSchema } from "zod";

export const validate = (
  schema: ZodSchema,
  source: "body" | "query" = "body"
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse(
      source === "body" ? req.body : req.query
    );

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    if (source === "body") {
      req.body = result.data;
    } else {
      Object.assign(req.query, result.data);
    }

    next();
  };
};