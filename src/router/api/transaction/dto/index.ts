import { z } from "zod";

export const createRateDto = z.object({
  body: z.object({
    accountId: z.string(),
    type: z.string().optional(),
    amount: z.number(),
    category: z.string(),
    description: z.string(),
  }),
});
