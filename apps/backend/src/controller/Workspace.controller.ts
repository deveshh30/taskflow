import { Request , Response , NextFunction } from "express";
import { Workspace } from "../model/workspace.model";
import { AuthRequest } from "../middleware/Auth.middleware";
import { createWorkspaceSchema } from "../schema/Workspace.schema";

export const createWorkspace = async (req : Request , res : Response , next : NextFunction) => {
    try {
        const validatedData = createWorkspaceSchema.parse(req.body);

        const workspace = new Workspace({
            name : validatedData.name,
            owner : req.user?.userId,
            members : [req.user?.userId]
        });

        await workspace.save();

        res.status(201).json({
            success: true,
            message: "Workspace created successfully",
            workspace
        });

    } catch (error) {
        throw error;
    }
};