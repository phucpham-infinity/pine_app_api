import { z } from "zod";

export const createCompanyDto = z.object({
  body: z.object({
    businessActivity: z.string(),
    companyName: z.string(),
    email: z.string(),
    legalType: z.string(),
    numberOfEmployees: z.number(),
    licenseNumber: z.string().optional(),
    backupEmail: z.string().optional(),
  }),
});

export const updateCompanyDto = z.object({
  body: z.object({
    businessActivity: z.string().optional(),
    email: z.string().optional(),
    backupEmail: z.string().optional(),
    legalType: z.string().optional(),
    numberOfEmployees: z.number().optional(),
    licenseNumber: z.string().optional(),
  }),
});
