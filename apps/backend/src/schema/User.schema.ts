import z from "zod";

export const registerSchema = z.object({
    fullName : z.string().min(3 , "Name above 3 characters is required").max(100),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    userName: z.string().min(6, "Username must be at least 6 characters")

});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>; // automatically creates a typescript type no nneed to write it again mannually it helps to avoid the mis matchinng and typo error