import { z } from "zod";

export const createRequetCompanyDto = z.object({
  body: z.object({
    userId: z.string(),
  }),
});

export const updateRequetCompanyDto = z.object({
  body: z.object({
    userId: z.string().optional(),
  }),
});
