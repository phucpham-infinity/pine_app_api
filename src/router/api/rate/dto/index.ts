import { z } from "zod";

export const createRateDto = z.object({
  body: z.object({
    name: z.string(),
    fee: z.string(),
    transactions: z.string(),
    atmDeposits: z.string(),
    addOns: z.string(),
    books: z.string(),
  }),
});

export const updateRateDto = z.object({
  body: z.object({
    name: z.string().optional(),
    fee: z.string().optional(),
    transactions: z.string().optional(),
    atmDeposits: z.string().optional(),
    addOns: z.string().optional(),
    books: z.string().optional(),
  }),
});
