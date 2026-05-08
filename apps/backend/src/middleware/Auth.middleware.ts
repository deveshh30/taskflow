import { Request ,Response ,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../config/index";


export const protect = async ( req: Request, res: Response, next: NextFunction ) => {
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
        next(error);
    }
}



// this protect middleware does 3 things 
// 1) check if the cookie is valid and exists,
// 2) verify that the token in not expired usinng jwt,
// 3) if valid , attact the user's id to req.user so the route handler knnow who is makinng the request