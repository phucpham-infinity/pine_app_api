import { z } from "zod";

export const sendChatDto = z.object({
  body: z.object({
    message: z.string(),
  }),
});

export const updateChatDto = z.object({
  body: z.object({
    message: z.string().optional(),
    isRead: z.boolean().optional(),
  }),
});
