import z from "zod";

export const createTaskSchema = z.object({
    title : z.string().min(3 , "Task title must be at least 3 characters").max(30),
    description : z.string().optional(),
    status : z.enum(["todo", "in-progress", "review", "done"]).default("todo"),
    priority : z.enum(["low" , "medium" , "high", "urgent"]).default("medium"),
    dueDate: z.string().datetime().optional(),
    assignee: z.string().optional(),
})


export type CreateTaskInput = z.infer<typeof createTaskSchema>;




// title (required)
// description (optional, rich text later)
// status → todo, in-progress, review, done
// priority → low, medium, high, urgent
// dueDate (optional)
// project → reference to Project (required)
// assignee → reference to User (optional, can be unassigned)
// createdBy