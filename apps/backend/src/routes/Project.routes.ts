import { Router } from "express";
import { protect } from "../middleware/Auth.middleware";
import { addMemberToProject, createProject, deleteProject, getProjectsByWorkspace, updateProject } from "../controller/Project.controller";
import { createTask, updateTask , deleteTask, getTasksByProject, getTaskByStatus } from "../controller/Task.controller";
import { requireProjectMember, requireProjectOwner, requireWorkspaceMember } from "../middleware/Authorization.middleware";

const router = Router();

router.post('/' , protect , createProject);
router.get('/workspace/:workspaceId', protect , requireWorkspaceMember , getProjectsByWorkspace);
router.put('/:projectId', protect, requireProjectOwner , updateProject);      
router.delete('/:projectId', protect, requireProjectOwner , deleteProject);  
router.post('/:projectId/tasks', protect, requireProjectMember , createTask); 
router.put("/:projectId/tasks/:taskId/update" , protect , requireProjectMember , updateTask)
router.delete("/:projectId/tasks/:taskId/delete" , protect , requireProjectMember , deleteTask )
router.get("/:projectId/getTasksByProject" , protect , requireProjectMember ,  getTasksByProject)
router.get("/:projectId/kanban" , protect , requireProjectMember , getTaskByStatus)
router.post('/:projectId/addmembers', protect , requireProjectOwner , addMemberToProject);

export default router;