import { Request , Response , NextFunction } from "express";
import { Workspace } from "../model/workspace.model";
import { Project } from "../model/Project.model";


export const requireWorkspaceMember = async (req : Request , res : Response , next : NextFunction) => {
    try {
        const {workspaceId} = req.params ;
        const workspace = await Workspace.findById(workspaceId);

        if(!workspace) {
            return res.status(404).json({
                success : false,
                message : "workspace does not found with this id",
            })
        };

        const isOwnerOrMember = 
        workspace.owner.toString() === req.user?.userId || 
        workspace.members.some((m: any) => m._id.toString() === req.user?.userId);

        if (!isOwnerOrMember) {
        return res.status(403).json({
            success: false,
            message: "You don't have access to this workspace"
        });
        }
        req.workspace = workspace;
        next();
        
    } catch (error) {
        next(error);
    }
};


export const requireWorkspaceOwner = async (req : Request , res : Response , next : NextFunction) => {
    try {
        const {workspaceId} = req.params ;
        const workspace = await Workspace.findById(workspaceId);

        if(!workspace) {
            return res.status(404).json({
                success : false,
                message : "workspace does not found with this id",
            })
        };

        const isOwner = 
        workspace.owner.toString() === req.user?.userId

        if (!isOwner) {
        return res.status(403).json({
            success: false,
            message: "You don't have access to this workspace"
        });
        }
        req.workspace = workspace;
        next();
        
    } catch (error) {
        next(error);
    }
};

export const requireProjectMember = async (req : Request , res : Response , next : NextFunction) => {
    try {

        const { projectId } = req.params ; 
        const project  = await Project.findById(projectId);

        if(!project) {
            return res.status(404).json({
                success : false,
                message : "project does not found with this id",
            })
        };

        const isOwnerOrMember = project.owner.toString() === req.user?.userId || 
        project.members.some((m : any) => m._id.toString() === req.user?.userId);

        if (!isOwnerOrMember) {
        return res.status(403).json({
            success: false,
            message: "You don't have access to this project"
        });
        }

        req.project = project;
        next();

    } catch (error) {
     next(error);   
    }
};


export const requireProjectOwner = async (req : Request , res : Response , next : NextFunction) => {
    try {

        const { projectId } = req.params ; 
        const project  = await Project.findById(projectId);

        if(!project) {
            return res.status(404).json({
                success : false,
                message : "project does not found with this id",
            })
        };

        const isOwner= project.owner.toString() === req.user?.userId 

        if (!isOwner) {
        return res.status(403).json({
            success: false,
            message: "You don't have access to this project"
        });
        }

        req.project = project;
        next();

    } catch (error) {
     next(error);   
    }
};