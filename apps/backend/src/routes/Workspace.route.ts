import { Router } from 'express';
import { protect } from '../middleware/Auth.middleware';
import { createWorkspace,  deleteWorkspace,  getWorkspace, getWorkspaceById, updateWorkspace } from '../controller/Workspace.controller.js';

const workspaceRoute = Router();

workspaceRoute.post('/', protect, createWorkspace);
workspaceRoute.get('/', protect, getWorkspace);
workspaceRoute.get('/:id', protect, getWorkspaceById);
workspaceRoute.put('/:id', protect, updateWorkspace);
workspaceRoute.delete('/:id' , deleteWorkspace)

export default workspaceRoute;