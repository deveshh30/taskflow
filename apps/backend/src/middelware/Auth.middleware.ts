import { Request ,Response ,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { config } from "dotenv";

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const protect = ( req: AuthRequest, res: Response, next: NextFunction ) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
      })};

      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

      req.user = { userId: decoded.userId };
      next();

    
    } catch (error) {
        throw error;
    }
}