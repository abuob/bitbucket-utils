import * as z from 'zod';
import { userTypeGuard } from './user.type-guard';

export const reviewerTypeGuard = z
    .object({
        user: userTypeGuard,
        role: z.union([z.literal('REVIEWER'), z.literal('AUTHOR '), z.literal('PARTICIPANT')]),
        status: z.union([z.literal('UNAPPROVED'), z.literal('APPROVED'), z.literal('NEEDS_WORK')]),
    })
    .nonstrict();
