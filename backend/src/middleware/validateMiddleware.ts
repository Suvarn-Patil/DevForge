import {
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    /*
     * =====================================================
     * 1. Try the complete Express request structure
     *
     * Used by validators such as:
     *
     * {
     *   body: {...},
     *   query: {...},
     *   params: {...}
     * }
     *
     * This is what our task validators use.
     * =====================================================
     */

    const fullResult = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (fullResult.success) {
      const data = fullResult.data as {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };

      /*
       * We can safely replace req.body because it is writable.
       */
      if (data.body !== undefined) {
        req.body = data.body;
      }

      /*
       * IMPORTANT:
       *
       * Do NOT assign to req.query.
       *
       * Express exposes req.query as a getter.
       */

      /*
       * Do NOT assign req.params either unless necessary.
       *
       * The controllers can continue using the original
       * route parameters.
       */

      return next();
    }

    /*
     * =====================================================
     * 2. Try the request body directly
     *
     * Used by validators such as team/project validators:
     *
     * z.object({
     *   name: z.string()
     * })
     * =====================================================
     */

    const bodyResult = schema.safeParse(req.body);

    if (bodyResult.success) {
      req.body = bodyResult.data;

      return next();
    }

    /*
     * =====================================================
     * 3. Try query parameters directly
     *
     * Useful for query validators that don't wrap the
     * query inside { query: ... }.
     * =====================================================
     */

    const queryResult = schema.safeParse(req.query);

    if (queryResult.success) {
      return next();
    }

    /*
     * =====================================================
     * 4. Try route parameters directly
     * =====================================================
     */

    const paramsResult = schema.safeParse(req.params);

    if (paramsResult.success) {
      return next();
    }

    /*
     * =====================================================
     * 5. Validation failed
     * =====================================================
     */

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: fullResult.error.issues,
    });
  };
};