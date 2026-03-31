import { Router } from 'express';
import { protect } from '../middleware/Auth.middleware';
import { createWorkspace,  getWorkspace, getWorkspaceById, updateWorkspace } from '../controller/Workspace.controller.js';

const workspaceRoute = Router();

workspaceRoute.post('/', protect, createWorkspace);
workspaceRoute.get('/', protect, getWorkspace);
workspaceRoute.get('/:id', protect, getWorkspaceById);
workspaceRoute.put('/:id', protect, updateWorkspace);

export default workspaceRoute;