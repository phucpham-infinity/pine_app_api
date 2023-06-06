import { z } from "zod";

export const registerDto = z.object({
  body: z.object({
    phone: z.string(),
    password: z.string(),
    isUseTouchId: z.boolean().default(false),
    isUseFaceId: z.boolean().default(false),
  }),
});

export const updateByPhoneDto = z.object({
  body: z.object({
    phone: z.string(),
    isUseTouchId: z.boolean().default(false),
    isUseFaceId: z.boolean().default(false),
  }),
});

export const loginDto = z.object({
  body: z.object({
    phone: z.string(),
    password: z.string(),
  }),
});
