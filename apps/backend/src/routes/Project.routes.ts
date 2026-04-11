import { Router } from "express";
import { protect } from "../middleware/Auth.middleware";
import { addMemberToProject, createProject, deleteProject, getProjectsByWorkspace, updateProject } from "../controller/Project.controller";
import { createTask, updateTask , deleteTask, getTasksByProject, getTaskByStatus } from "../controller/Task.controller";

const router = Router();

router.post('/' , protect , createProject);
router.get('/workspace/:workspaceId', protect, getProjectsByWorkspace);
router.put('/:projectId', protect, updateProject);      
router.delete('/:projectId', protect, deleteProject);  
router.post('/:projectId/tasks', protect, createTask); 
router.put("/:projectId/tasks/:taskId/update" , protect , updateTask)
router.delete("/:projectId/tasks/:taskId/delete" , protect , deleteTask )
router.get("/:projectId/getTasksByProject" , protect , getTasksByProject)
router.get("/:projectId/kanban" , protect , getTaskByStatus)
router.post('/:projectId/addmembers', protect, addMemberToProject);

export default router;