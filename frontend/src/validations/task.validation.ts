import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters"),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters"),
});

export type TaskFormData = z.infer<typeof taskSchema>;