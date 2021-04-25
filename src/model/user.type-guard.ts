import * as z from 'zod';

export const userTypeGuard = z
    .object({
        name: z.string(),
        emailAddress: z.string(),
        id: z.number().int().optional(),
        displayName: z.string().optional(),
        active: z.boolean().optional(),
        slug: z.string().optional(),
    })
    .nonstrict();
