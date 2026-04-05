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

export const updateTask = async (req : AuthRequest , res: Response) => {
  try {
    const updateSchema = createTaskSchema.partial();
    const {projectId , taskId} = req.params;

    const validatedData = updateSchema.parse(req.body);

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    if(task.project.toString() !== projectId){
      return res.status(400).json({
        success: false,
        message: "Task does not belong to this project",
    });
  }

  const project = await Project.findById(projectId);

  const isProjectMember = project && (
      project.owner.toString() === req.user?.userId ||
      project.members.some((m: any) => m.toString() === req.user?.userId)
    );


const isTaskCreator = task.createdBy.toString() === req.user?.userId;

    if (!isProjectMember && !isTaskCreator) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this task"
      });
    }

    Object.assign(task, validatedData);
    await task.save();

    
    await task.populate('assignee', 'name email username');
    await task.populate('createdBy', 'name email username');

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (req : AuthRequest , res: Response) => {
  try {
    const {projectId , taskId} = req.params;

    const validatedData = updateSchema.parse(req.body);

    const task = await.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    if(task.project.toString() !== projectId){
      return res.status(400).json({
        success: false,
        message: "Task does not belong to this project"
      });
    }

    const project = await Project.findById(projectId);
    const isProjectOwner = project && project.owner.toString() === req.user?.userId;
    const isTaskCreator = task.createdBy.toString() === req.user?.userId;
    
    if (!isProjectOwner && !isTaskCreator) {
      return res.status(403).json({
        success: false,
        message: "Only task creator or project owner can delete this task"
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {
    throw error;
  }
}