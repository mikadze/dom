import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
        }) as unknown as void;
      }
      next(error);
    }
  };
}
