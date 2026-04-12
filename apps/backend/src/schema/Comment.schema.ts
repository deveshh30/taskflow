import z from "zod";

export const createCommentSchema = z.object ({
    content : z.string().min(1 , "a comment can not be empty").max(200),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>;