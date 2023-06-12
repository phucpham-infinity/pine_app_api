import { z } from "zod";

export const createRateDto = z.object({
  body: z.object({
    cardType: z.string(),
    nicname: z.string(),
    status: z.string(),
    cardNumber: z.string(),
    accountNumber: z.string(),
    isMain: z.boolean().optional(),
  }),
});

export const updateRateDto = z.object({
  body: z.object({
    cardType: z.string().optional(),
    nicname: z.string().optional(),
    status: z.string().optional(),
    cardNumber: z.string().optional(),
    accountNumber: z.string().optional(),
    isMain: z.boolean().optional(),
  }),
});
