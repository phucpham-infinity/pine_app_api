import { z } from "zod";

export const createProfileDto = z.object({
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    nationality: z.string(),
    IDNumber: z.string().optional(),
    passportNumber: z.string().optional(),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
  }),
});

export const updateProfileDto = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    nationality: z.string().optional(),
    IDNumber: z.string().optional(),
    passportNumber: z.string().optional(),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
  }),
});
