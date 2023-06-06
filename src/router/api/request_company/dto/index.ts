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
