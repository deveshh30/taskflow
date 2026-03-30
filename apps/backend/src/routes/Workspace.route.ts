import { Router } from 'express';
import { protect } from '../middleware/Auth.middleware';
import { createWorkspace } from '../controller/Workspace.controller.js';

const workspaceRoute = Router();

workspaceRoute.post('/', protect, createWorkspace);

export default workspaceRoute;