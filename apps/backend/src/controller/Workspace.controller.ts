import { Response } from 'express';
import { Workspace } from '../model/workspace.model.js';
import { createWorkspaceSchema } from '../schema/Workspace.schema.js';
import { AuthRequest } from '../middleware/Auth.middleware.js';

export const createWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createWorkspaceSchema.parse(req.body);

    const workspace = new Workspace({
      name: validatedData.name,
      owner: req.user?.userId,
      members: [req.user?.userId]   //the owner should also be a member of their own workspace     
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


// If we use normal Request type instead of AuthRequest, TypeScript will not know about 
// the req.user property. So when we write req.user?.userId, we will get a TypeScript error,
//  and even if we ignore it, we won't have type safety. More importantly, we won't reliably 
// know who the logged-in user is, which means we can't securely set the owner of the workspace.



export const getWorkspace = async ( req : AuthRequest , res : Response) => {
    try {
        const workspaces = await Workspace.find({
            $or: [
            { owner: req.user?.userId },
            { members: req.user?.userId }
        ]
        }).sort({ createdAt: -1 })
        .populate('owner', 'name email username')   
      .populate('members', 'name email username')
      .select('name owner members createdAt updatedAt');

        res.status(200).json({
        success: true,
        count: workspaces.length,
        workspaces
        });
    } catch (error) {
        throw error;
    }
};

export const getWorkspaceById = async (req: AuthRequest, res: Response) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email username')
      .populate('members', 'name email username');

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    // Only allow owner or members to view
    const isOwnerOrMember = 
      workspace.owner.toString() === req.user?.userId || 
      workspace.members.some((m: any) => m._id.toString() === req.user?.userId);

    if (!isOwnerOrMember) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this workspace"
      });
    }

    res.status(200).json({
      success: true,
      workspace
    });
  } catch (error) {
    throw error;
  }
};

export const updateWorkspace = async ( req: AuthRequest, res: Response) => {
  try {
    const validatedData = createWorkspaceSchema.parse(req.body);

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    // Only owner can update
    if (workspace.owner.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: "Only workspace owner can update it"
      });
    }

    workspace.name = validatedData.name;
    await workspace.save();

    res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      workspace
    });

  } catch (error) {
    throw error;
  }
}