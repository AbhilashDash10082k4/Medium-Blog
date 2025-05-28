import z from 'zod';
export const signUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6, {message: "Enter a password of minimum 6 characters"})
})

export type signUpTypes = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {message: "Enter a password of minimum 6 characters"})
})
export type signInTypes = z.infer<typeof signInSchema>;

export const createBlog = z.object({
    title: z.string(),
    content: z.string()
})
export type createBlogTypes  = z.infer<typeof createBlog>;


export const updateBlog = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number(),
})
export type updateBlogTypes  = z.infer<typeof updateBlog>;