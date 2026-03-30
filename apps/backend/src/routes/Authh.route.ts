import { Request, Response, Router } from "express";
import { loginUser, registerUser } from "../controller/auth.controller";
import { protect } from "../middleware/Auth.middleware";
import {  createWorkspace } from "../controller/Workspace.controller";

const router = Router();

router.post('/register' , registerUser);
router.post('/login' , loginUser);

router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    message: 'You are authenticated',
    userId: (req as any).user?.userId
  });
});
export default router;