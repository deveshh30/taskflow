import { Router } from "express";
import { protect } from "../middleware/Auth.middleware";
import { addComment, deleteComment, getCommentsByTask, updateComment } from "../controller/comment.controller";

const router = Router();

router.post('/:projectId/tasks/:taskId/comments' , protect , addComment);
router.put('/:projectId/tasks/:taskId/comments/:commentId', protect, updateComment);
router.delete('/:projectId/tasks/:taskId/comments/:commentId', protect, deleteComment);
router.get('/:projectId/tasks/:taskId/getComments' , protect , getCommentsByTask);

export default router;