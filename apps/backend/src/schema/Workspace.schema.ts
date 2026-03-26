import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(3, "Workspace name must be at least 3 characters").max(50),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;