import { z } from "zod";

export const createRateDto = z.object({
  body: z.object({
    accountId: z.string(),
    type: z.string().optional(),
    amount: z.string(),
    category: z.string(),
    description: z.string(),
    companyId: z.string(),
    cardNumber: z.string().optional(),
    accountNumber: z.string().optional(),
    recipientType: z.string().optional(),
    recipientName: z.string().optional(),
    recipientEmail: z.string().optional(),
    recipientPhone: z.string().optional(),
    detailDueDate: z.string().optional(),
    detailType: z.string().optional(),
    invoiceNumber: z.string().optional(),
    transactionsId: z.string().optional(),
    toCompanyName: z.string().optional(),
    toIban: z.string().optional(),
    toSwiftCode: z.string().optional(),
    detailAmount: z.string().optional(),
    transferNumber: z.string().optional(),
  }),
});
