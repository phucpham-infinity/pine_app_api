import { z } from "zod";

export const createAtachmentDto = z.object({
  body: z.object({
    companyId: z.string(),
    url: z.string(),
    type: z.string(),
    name: z.string(),
  }),
});

export const updateAtachmentDto = z.object({
  body: z.object({
    url: z.string().optional(),
    type: z.string().optional(),
    name: z.string().optional(),
  }),
});
