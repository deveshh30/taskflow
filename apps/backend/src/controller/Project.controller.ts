import { Project } from "../model/Project.model";
import { Workspace } from "../model/workspace.model";
import { AuthRequest } from "../middleware/Auth.middleware";
import { createProjectSchema } from "../schema/Project.schema";
import { Response } from "express";
import { User } from "../model/User.model";


export const createProject = async (req : AuthRequest , res : Response) => {
    try {

        const { workspaceId } = req.params;

        const validatedData = createProjectSchema.parse(req.body);

        const project = new Project({
            ...validatedData,
            workspace : workspaceId, // later fetch from frontend
            owner : req.user?.userId,
            members : validatedData.members || [req.user?.userId],
        });

        await project.save();

        await project.populate('owner', 'name email username');
        await project.populate('members', 'name email username');

        const formattedProject = {
            projectId: project._id,
            name: project.name,
            description: project.description,
            status: project.status,
            priority: project.priority,
            deadline: project.deadline,
            workspace: project.workspace,
            owner: {
                userId: project.owner._id,
                name: project.owner.name,
                email: project.owner.email,
                username: project.owner.username
            },
        members: project.members.map((m: any) => ({
            userId: m._id,
            name: m.name,
            email: m.email,
            username: m.username
      })),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: formattedProject
    });
    } catch (error) {
        throw error;
    }
};

export const getProjectsByWorkspace = async ( req : AuthRequest , res : Response) => {
    try {

        const {workspaceId} = req.params;
        const workspace = await Workspace?.findById(workspaceId);

        if(!workspace) {
            return res.status(404).json({
                success: false,
                message: "Workspace not found"
            });
        }

        const isMember = workspace.owner.toString() === req.user?.userId || workspace.members.some((m:any) => m.toString() === req.user?.userId);

        if(!isMember) {
            return res.status(403).json({
            success: false,
            message: "You don't have access to this workspace"
        });
        }

        const projects = await Project.find({workspace: workspaceId})
        .sort({ createdAt: -1 })
        .populate('owner', 'name email username')
        .populate('members', 'name email username')
        .lean();

        const formattedProjects = projects.map(p => ({
        projectId: p._id,
        name: p.name,
        description: p.description,
        status: p.status,
        priority: p.priority,
        deadline: p.deadline,
        owner: {
            userId: p.owner._id,
            name: p.owner.name,
            email: p.owner.email,
            username: p.owner.username
        },
        members: p.members.map((m: any) => ({
            userId: m._id,
            name: m.name,
            email: m.email,
            username: m.username
        })),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
        }));

        res.status(200).json({
        success: true,
        count: formattedProjects.length,
        projects: formattedProjects
        });

    } catch (error) {
        throw error;
    }
};


export const updateProject = async ( req : AuthRequest , res : Response) => {
    try {
        const updateSchema = createProjectSchema.partial(); //this will make every aspect optional to update
        const {projectId} = req.params;

        const validatedData = updateSchema.parse(req.body);

        const project = await Project.findById(projectId);

        if(!project) {
            return res.status(404).json({
                success : false,
                message : "project not found"
            });
        };

        if(project.owner.toString() !== req.user?.userId){
            return res.status(403).json({
                success: false,
                message: "Only project owner can update this project"
            });
        }

    Object.assign(project, validatedData); // to update only the fields that were sent.

    await project.save();

    await project.populate('owner', 'name email username');
    await project.populate('members', 'name email username');

    const formattedProject = {
      projectId: project._id,
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      deadline: project.deadline,
      owner: {
        userId: project.owner._id,
        name: project.owner.name,
        email: project.owner.email,
        username: project.owner.username
      },
      members: project.members.map((m: any) => ({
        userId: m._id,
        name: m.name,
        email: m.email,
        username: m.username
      })),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: formattedProject
    });
    

    } catch (error) {
        throw error;
    }
};

export const deleteProject = async ( req: AuthRequest , res : Response) => {
    try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (project.owner.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can delete this project"
      });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    throw error;
  }
};

export const addMemberToProject = async ( req: AuthRequest , res : Response) => {
//1. Get projectId from req.params and userId from req.body
//2. Check if the project exists
//3. Check if the current logged-in user is the project owner (not workspace owner)
//4. Check if the user to add exists in the system
//5. Check if the user is a member of the workspace (yes, this is important)
//6. Check if the user is already a member of the project
//7. Add the user to project.members array
//8. Save the project and return success

    try {
        const {userId} = req.body;
        const {projectId} = req.params;

        const project= await Project.findById(projectId);

        if(!project) {
           return res.status(404).json({
                success: false,
                message: "project not found"
            }); 
        }

        if(project.owner.toString() !== req.user?.userId) {
          return res.status(403).json({
                success: false,
                message: "Only project owner can add members"
            });  
        }

        const user = await User.findById(userId);
        if (!user) {
              return res.status(404).json({
                success: false,
                message: "User not found"
              });
        }

        const workspace = await Workspace.findById(project.workspace);

        if (!workspace) {
        return res.status(404).json({
            success: false,
            message: "Workspace not found"
        });
        }

        const isWorkspaceMember = 
        workspace.owner.toString() === userId || 
        workspace.members.some((m: any) => m.toString() === userId);

        if (!isWorkspaceMember) {
        return res.status(400).json({
            success: false,
            message: "User must be a member of the workspace first"
        });
        }

        const isAlreadyMember = project.members.some(
        (memberId: any) => memberId.toString() === userId
        );

        if (isAlreadyMember) {
        return res.status(400).json({
            success: false,
            message: "User is already a member of this project"
        });
        }

        project.members.push(userId);
        await project.save();


        res.status(200).json({
        success: true,
        message: "Member added successfully",
        project: {
            id: project._id,
            name: project.name,
            members: project.members
      }
    });
        
    } catch (error) {
        throw error;
    }
};