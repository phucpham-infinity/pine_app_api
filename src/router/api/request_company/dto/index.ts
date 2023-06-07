import { z } from "zod";

export const createRequetCompanyDto = z.object({
  body: z.object({
    companyName: z.string(),
    licenseNo: z.string(),
    registerNo: z.string(),
    companyEmail: z.string(),
    userEmail: z.string(),
  }),
});

export const updateRequetCompanyDto = z.object({
  body: z.object({
    companyName: z.string().optional(),
    licenseNo: z.string().optional(),
    registerNo: z.string().optional(),
    companyEmail: z.string().optional(),
    userEmail: z.string().optional(),
  }),
});
