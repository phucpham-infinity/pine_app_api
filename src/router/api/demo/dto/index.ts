import { z } from "zod";

export const createRateDto = z.object({
  body: z.object({
    phone: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    nationality: z.string(),
    IDNumber: z.string().optional(),
    passportNumber: z.string().optional(),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
    companyId: z.string().optional(),
  }),
});

export const updateRateDto = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    nationality: z.string().optional(),
    IDNumber: z.string().optional(),
    passportNumber: z.string().optional(),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
    companyName: z.string().optional(),
    phone: z.string(),
  }),
});
