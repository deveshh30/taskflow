import { Response } from "express";
import { AuthRequest } from "../middleware/Auth.middleware";
import { createCommentSchema } from "../schema/Comment.schema";
import { Task } from "../model/Task.model";
import { Project } from "../model/Project.model";
import { Comment } from "../model/Comment.model";

export const addComment = async (req : AuthRequest , res : Response) => {


// --> Get projectId and taskId from params
// --> Get content from body
// --> Check if task exists
// --> Check if user has access to the project
// --> Create comment with task, author, content
// --> Save and return populated comment
    try {
        const {projectId , taskId} = req.params;
        const validatedData = createCommentSchema.parse(req.body);
        const content = validatedData.content;

        const project = await Project.findById(projectId);
        const task = await Task.findById(taskId);

        if(!project) {
            return res.status(404).json({
                success : false,
                message : "project not found",
            });
        }

        if(!task) {
            return res.status(404).json({
                success : false,
                message : "task not found",
            });
        }

        const isAuthorized = project.owner.toString() === req.user?.userId ||
                project.members.some((m : any) => m.toString() === req.user?.userId);


        if(!isAuthorized){
            return res.status(403).json({
                success : false,
                message : "you dont have access to this project",
            });
        }

        const comment = new Comment ({
            content,
            task : taskId,
            author : req.user?.userId

        });
        await comment.save();

        await comment.populate('author' , 'name email userName');

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment
    });



    } catch (error) {
        throw error;
    }
}

export const updateComment = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId, taskId, commentId } = req.params;
        const validatedData = createCommentSchema.parse(req.body);

        const project = await Project.findById(projectId);
        const task = await Task.findById(taskId);
        const comment = await Comment.findById(commentId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "project not found",
            });
        }

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "task not found",
            });
        }

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "comment not found",
            });
        }

        if (task.project.toString() !== projectId || comment.task.toString() !== taskId) {
            return res.status(400).json({
                success: false,
                message: "comment does not belong to this task",
            });
        }

        const isAuthorized =
            project.owner.toString() === req.user?.userId ||
            comment.author.toString() === req.user?.userId;

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: "you don't have permission to update this comment",
            });
        }

        comment.content = validatedData.content;
        await comment.save();
        await comment.populate("author", "name email userName");

        res.status(200).json({
            success: true,
            message: "comment updated successfully",
            comment,
        });
    } catch (error) {
        throw error;
    }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId, taskId, commentId } = req.params;

        const project = await Project.findById(projectId);
        const task = await Task.findById(taskId);
        const comment = await Comment.findById(commentId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "project not found",
            });
        }

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "task not found",
            });
        }

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "comment not found",
            });
        }

        if (task.project.toString() !== projectId || comment.task.toString() !== taskId) {
            return res.status(400).json({
                success: false,
                message: "comment does not belong to this task",
            });
        }

        const isAuthorized =
            project.owner.toString() === req.user?.userId ||
            comment.author.toString() === req.user?.userId;

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: "you don't have permission to delete this comment",
            });
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            message: "comment deleted successfully",
        });
    } catch (error) {
        throw error;
    }
};