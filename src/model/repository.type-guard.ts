import * as z from 'zod';

export const repositoryTypeGuard = z
    .object({
        slug: z.string(),
        id: z.number().int(),
        name: z.string(),
    })
    .nonstrict();
