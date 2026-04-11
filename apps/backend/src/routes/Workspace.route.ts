import { Router } from 'express';
import { protect } from '../middleware/Auth.middleware';
import { addMemberToWorkspace, createWorkspace,  deleteWorkspace,  getWorkspace, getWorkspaceById, updateWorkspace } from '../controller/Workspace.controller.js';

const workspaceRoute = Router();

workspaceRoute.post('/', protect, createWorkspace);
workspaceRoute.get('/', protect, getWorkspace);
workspaceRoute.get('/:id', protect, getWorkspaceById);
workspaceRoute.put('/:id', protect, updateWorkspace);
workspaceRoute.delete('/:id' , deleteWorkspace);
workspaceRoute.post('/:workspaceId/addmember' , protect , addMemberToWorkspace);

export default workspaceRoute;

// http://localhost:4000/api/workspace/69cc28e93d3bcd041523f0a8/addmember