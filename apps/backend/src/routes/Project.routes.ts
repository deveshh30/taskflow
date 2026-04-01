import { Router } from "express";
import { protect } from "../middleware/Auth.middleware";
import { createProject } from "../controller/Project.controller";

const createproject = Router();

createproject.post('/' , protect , createProject);

export default createproject;