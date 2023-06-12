import { z } from "zod";

export const createRateDto = z.object({
  body: z.object({
    cardType: z.string(),
    nicname: z.string(),
    status: z.string(),
    cardNumber: z.string(),
    accountNumber: z.string(),
    accountId: z.string(),
  }),
});

export const updateRateDto = z.object({
  body: z.object({
    cardType: z.string().optional(),
    nicname: z.string().optional(),
    status: z.string().optional(),
    cardNumber: z.string().optional(),
    accountNumber: z.string().optional(),
  }),
});
