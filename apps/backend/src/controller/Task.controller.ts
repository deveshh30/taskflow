import { Response } from "express";
import { Task } from "../model/Task.model";
import { createTaskSchema } from "../schema/Task.schema";
import { AuthRequest } from "../middleware/Auth.middleware";
import { Project } from "../model/Project.model";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const validatedData = createTaskSchema.parse(req.body);

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isProjectMember =
      project.members.some((m: any) => m.toString() === req.user?.userId) ||
      project.owner.toString() === req.user?.userId;

    if (!isProjectMember) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this project",
      });
    }

    const task = new Task({
      ...validatedData,
      project: projectId,
      createdBy: req.user?.userId,
      assignee: validatedData.assignee || undefined,
    });

    await task.save();

    await task.populate("assignee", "name email username");
    await task.populate("createdBy", "name email username");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const updateSchema = createTaskSchema.partial();
    const { projectId, taskId } = req.params;

    const validatedData = updateSchema.parse(req.body);

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.project.toString() !== projectId) {
      return res.status(400).json({
        success: false,
        message: "Task does not belong to this project",
      });
    }

    const project = await Project.findById(projectId);

    const isProjectMember =
      project &&
      (project.owner.toString() === req.user?.userId ||
        project.members.some((m: any) => m.toString() === req.user?.userId));

    const isTaskCreator = task.createdBy.toString() === req.user?.userId;

    if (!isProjectMember && !isTaskCreator) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this task",
      });
    }

    Object.assign(task, validatedData);
    await task.save();

    await task.populate("assignee", "name email username");
    await task.populate("createdBy", "name email username");

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, taskId } = req.params;

    const validatedData = updateSchema.parse(req.body);

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.project.toString() !== projectId) {
      return res.status(400).json({
        success: false,
        message: "Task does not belong to this project",
      });
    }

    const project = await Project.findById(projectId);
    const isProjectOwner =
      project && project.owner.toString() === req.user?.userId;
    const isTaskCreator = task.createdBy.toString() === req.user?.userId;

    if (!isProjectOwner && !isTaskCreator) {
      return res.status(403).json({
        success: false,
        message: "Only task creator or project owner can delete this task",
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};

export const getTasksByProject = async (req: AuthRequest, res: Response) => {
  // First, get projectId from req.params
  // Then, check if project exists
  // Then, check if user has access to the project
  // Then, find all tasks where project = projectId
  // Populate assignee and createdBy
  // Format the response nicely (with taskId)
  // Return the list

  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "project not found",
      });
    }

    const isAuthorized =
      project.owner.toString() === req.user?.userId ||
      project.members.some((m: any) => m.toString() === req.user?.userId);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this project",
      });
    }

    const tasks = await Task.find({ project: projectId })
      .sort({ createdAt: -1 })
      .populate("assignee", "name email username")
      .populate("createdBy", "name email username")
      .lean();

    const formattedTasks = tasks.map((task) => ({
      taskId: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee
        ? {
            userId: task.assignee._id,
            name: task.assignee.name,
            email: task.assignee.email,
          }
        : null,
      createdBy: {
        userId: task.createdBy._id,
        name: task.createdBy.name,
      },
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedTasks.length,
      tasks: formattedTasks,
    });
  } catch (error) {
    throw error;
  }
};

export const getTaskByStatus = async ( req : AuthRequest , res : Response) => {

  try {
    const { projectId} = req.params;

    const project = await Project.findById(projectId);

    if(!project) {
      return res.status(404).json({
        success : false,
        message : "project not found",
      });
    }

    const isAuthorized = project.owner.toString() === req.user?.userId ||
    project.members.some( (m:any) => m.toString() === req.user?.userId );


    if(!isAuthorized) {
      return res.status(403).json({
        success : false,
        message : " you dont have access to this project",
      });
    }

    const tasks = await Task.find({project : projectId})
    .sort({createdAt : -1})
    .populate("assignee", "name email username")
    .populate("createdBy", "name email username")
    .lean();

    const kanban = tasks.reduce((acc: any, task: any) => { //reduce is used here because it iterates over the array of tasks annd present all task with specific status
      const status = task.status || "todo";
      if (!acc[status]) acc[status] = [];

      acc[status].push({
        taskId: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.assignee ? {
          userId: task.assignee._id,
          name: task.assignee.name,
          email: task.assignee.email,
        } : null,
        createdBy: {
          userId: task.createdBy._id,
          name: task.createdBy.name,
        },
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      });

      return acc;
    }, {});

    res.status(200).json({
      success: true,
      kanban
    });


  } catch (error) {
    throw error;
  }

//1. Get projectId from req.params
//2. Check if project exists
//3. Check if current user is owner or member of the project
//4. Fetch all tasks belonging to that projectId
//5. Group the tasks by status (todo, in-progress, review, done)
//6. Format each task nicely (taskId, userId, etc.)
//7. Return a clean kanban object
}

