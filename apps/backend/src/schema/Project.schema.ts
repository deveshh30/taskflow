import z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters").max(100),
  description: z.string().optional(),
  workspace: z.string().min(1, "Workspace is required"),
  status: z.enum(["planning", "active", "on-hold", "completed", "cancelled"]).default("planning"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  deadline: z.string().datetime().optional(),   
  members: z.array(z.string()).optional(),
});
""
export type CreateProjectInput = z.infer<typeof createProjectSchema>;