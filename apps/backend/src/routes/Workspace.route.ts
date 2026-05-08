import { Router } from 'express';
import { protect } from '../middleware/Auth.middleware';
import { addMemberToWorkspace, createWorkspace,  deleteWorkspace,  getWorkspace, getWorkspaceById, updateWorkspace } from '../controller/Workspace.controller.js';
import { requireWorkspaceMember, requireWorkspaceOwner } from '../middleware/Authorization.middleware';

const workspaceRoute = Router();

workspaceRoute.post('/', protect, createWorkspace);
workspaceRoute.get('/', protect, getWorkspace);
workspaceRoute.get('/:workspaceId', protect, requireWorkspaceMember , getWorkspaceById);
workspaceRoute.put('/:workspaceId', protect, requireWorkspaceOwner , updateWorkspace);
workspaceRoute.delete('/:workspaceId' , protect , requireWorkspaceOwner , deleteWorkspace);
workspaceRoute.post('/:workspaceId/addmember' , protect , requireWorkspaceOwner , addMemberToWorkspace);

export default workspaceRoute;

// http://localhost:4000/api/workspace/69cc28e93d3bcd041523f0a8/addmember