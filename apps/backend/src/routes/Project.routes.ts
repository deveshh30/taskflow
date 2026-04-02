import { Router } from "express";
import { protect } from "../middleware/Auth.middleware";
import { createProject, getProjectsByWorkspace } from "../controller/Project.controller";

const createproject = Router();

createproject.post('/' , protect , createProject);
createproject.get('/workspace/:workspaceId', protect, getProjectsByWorkspace);

export default createproject;