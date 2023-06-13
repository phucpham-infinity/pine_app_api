import { z } from "zod";

export const createAccountDto = z.object({
  body: z.object({
    accountName: z.string(),
    accountNumber: z.string(),
    iban: z.string(),
    swiftCode: z.string(),
    isMain: z.boolean().optional(),
  }),
});

export const updateAccountDto = z.object({
  body: z.object({
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    iban: z.string().optional(),
    swiftCode: z.string().optional(),
    isMain: z.boolean().optional(),
  }),
});
