import { z } from "zod";

export const createSettingDto = z.object({
  body: z.object({
    enableBiometric: z.boolean().optional(),
    confirmationMethods: z.string().optional(),
    receiveNotificationsForPaymentsAndTransfers: z.boolean().optional(),
    receiveNotificationsForDeposits: z.boolean().optional(),
    receiveNotificationsForOutstandingInvoices: z.boolean().optional(),
    receiveNotificationsForExceedingSetLimits: z.boolean().optional(),
    notificationMethods: z.string().optional(),
    mainAccountId: z.string().optional(),
  }),
});

export const updateSettingDto = z.object({
  body: z.object({
    enableBiometric: z.boolean().optional(),
    confirmationMethods: z.string().optional(),
    receiveNotificationsForPaymentsAndTransfers: z.boolean().optional(),
    receiveNotificationsForDeposits: z.boolean().optional(),
    receiveNotificationsForOutstandingInvoices: z.boolean().optional(),
    receiveNotificationsForExceedingSetLimits: z.boolean().optional(),
    notificationMethods: z.string().optional(),
    mainAccountId: z.string().optional(),
  }),
});
