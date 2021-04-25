import * as z from 'zod';
import { userTypeGuard } from '../../model/user.type-guard';
import { reviewerTypeGuard } from '../../model/reviewer.type-guard';
import { refTypeGuard } from '../../model/ref.type-guard';

export const prDataTypeGuard = z
    .object({
        id: z.number(),
        title: z.string(),
        state: z.union([z.literal('OPEN'), z.literal('MERGED'), z.literal('DECLINED ')]),
        open: z.boolean(),
        closed: z.boolean(),
        createdDate: z.number(),
        updatedDate: z.number(),
        closedDate: z.number(),
        author: z
            .object({
                user: userTypeGuard,
            })
            .nonstrict(),
        reviewers: z.array(reviewerTypeGuard),
        fromRef: refTypeGuard,
        toRef: refTypeGuard,
    })
    .nonstrict();

export type prDataType = z.infer<typeof prDataTypeGuard>;
