import { Response } from 'express';
import { Task } from '../model/Task.model';
import { createTaskSchema } from '../schema/Task.schema';
import { AuthRequest } from '../middleware/Auth.middleware';
import { Project } from '../model/Project.model';

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const validatedData = createTaskSchema.parse(req.body);

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

     
    const isProjectMember = project.members.some((m: any) => m.toString() === req.user?.userId) 
                         || project.owner.toString() === req.user?.userId;

    if (!isProjectMember) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this project"
      });
    }

    const task = new Task({
      ...validatedData,
      project: projectId,
      createdBy: req.user?.userId,
      assignee: validatedData.assignee || undefined
    });

    await task.save();

    
    await task.populate('assignee', 'name email username');
    await task.populate('createdBy', 'name email username');

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });
  } catch (error) {
    throw error;
  }
};