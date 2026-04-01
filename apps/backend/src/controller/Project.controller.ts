import { Project } from "../model/Project.model";
import { AuthRequest } from "../middleware/Auth.middleware";
import { createProjectSchema } from "../schema/Project.schema";
import { Response } from "express";


export const createProject = async (req : AuthRequest , res : Response) => {
    try {
        const validatedData = createProjectSchema.parse(req.body);

        const project = new Project({
            ...validatedData,
            workspace : validatedData.workspace, // later fetch from frontend
            owner : req.user?.userId,
            member : validatedData.members || [req.user?.userId],
        });

        await project.save();

        await project.populate('owner', 'name email username');
        await project.populate('members', 'name email username');

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        });
    } catch (error) {
        throw error;
    }
}