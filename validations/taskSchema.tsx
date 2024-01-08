import * as z from "zod";

export const TaskSchema = z.object({
  collectionId: z.string(),
  name: z.string().min(1, {
    message: "Task name is required!",
  }),
  description: z.string().min(1, {
    message: "Task description is required!",
  }),
  expiresAt: z.date().optional(),
});

export type TaskSchemaType = z.infer<typeof TaskSchema>;
