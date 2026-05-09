import { Request, Response, Router } from "express";
import { loginUser, registerUser } from "../controller/auth.controller";
import { protect } from "../middleware/Auth.middleware";
import {  createWorkspace } from "../controller/Workspace.controller";
import { authLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.post('/register' , authLimiter ,  registerUser);
router.post('/login' , authLimiter , loginUser);

router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    message: 'You are authenticated',
    userId: req.user?.userId
  });
});
export default router;