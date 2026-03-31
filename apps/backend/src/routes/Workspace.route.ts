import { Router } from 'express';
import { protect } from '../middleware/Auth.middleware';
import { createWorkspace,  getWorkspace } from '../controller/Workspace.controller.js';

const workspaceRoute = Router();

workspaceRoute.post('/', protect, createWorkspace);
workspaceRoute.get('/', protect, getWorkspace);

export default workspaceRoute;