import * as z from "zod";

import { CollectionColors } from "@/lib/constants";

export const CollectionSchema = z.object({
  name: z.string().min(4, {
    message: "Collection name must be at least 4 character long",
  }),
  color: z
    .string()
    .refine((color) => Object.keys(CollectionColors).includes(color)),
});

export type CollectionSchemaType = z.infer<typeof CollectionSchema>;
