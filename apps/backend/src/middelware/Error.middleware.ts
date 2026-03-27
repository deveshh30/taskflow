import { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // for Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues.map((e: ZodIssue) => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // for other errors
  console.error('Error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};