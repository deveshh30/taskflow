import { Router } from "express";
import { protect } from "../middleware/Auth.middleware";
import { createProject, deleteProject, getProjectsByWorkspace, updateProject } from "../controller/Project.controller";
import { createTask, updateTask } from "../controller/Task.controller";

const router = Router();

router.post('/' , protect , createProject);
router.get('/workspace/:workspaceId', protect, getProjectsByWorkspace);
router.put('/:projectId', protect, updateProject);      
router.delete('/:projectId', protect, deleteProject);  
router.post('/:projectId/tasks', protect, createTask); 
router.post("/:projectId/tasks/:taskId/update" , protect , updateTask)
router.post("/:projectId/tasks/:taskId/delete" , protect , )

export default router;