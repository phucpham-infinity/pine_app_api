import { z } from "zod";

export const createCompanyDto = z.object({
  body: z.object({
    businessActivity: z.string(),
    companyName: z.string(),
    email: z.string(),
    legalType: z.string(),
    numberOfEmployees: z.number(),
  }),
});
