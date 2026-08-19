import {
  Request,
  Response,
  NextFunction,
} from "express";

interface AppError {
  statusCode?: number;
  message?: string;
}

const isAppError = (
  error: unknown
): error is AppError => {
  return (
    typeof error === "object" &&
    error !== null &&
    (
      "statusCode" in error ||
      "message" in error
    )
  );
};

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  const statusCode =
    isAppError(err) && err.statusCode
      ? err.statusCode
      : 500;

  const message =
    isAppError(err) && err.message
      ? err.message
      : "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
