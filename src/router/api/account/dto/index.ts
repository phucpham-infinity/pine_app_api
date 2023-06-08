import { z } from "zod";

export const createAccountDto = z.object({
  body: z.object({
    accountName: z.string(),
    accountNumber: z.string(),
    iban: z.string(),
    swiftCode: z.string(),
  }),
});
