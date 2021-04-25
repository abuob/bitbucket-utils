import * as z from 'zod';

export const userTypeGuard = z
    .object({
        name: z.string(),
        emailAddress: z.string(),
        id: z.number().int(),
        displayName: z.string(),
        active: z.boolean(),
        slug: z.string(),
    })
    .nonstrict();
