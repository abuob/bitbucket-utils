import * as z from 'zod';
import { userTypeGuard } from '../../model/user.type-guard';

export const branchesWithDetailsTypeGuard = z
    .object({
        size: z.number().int(),
        limit: z.number().int(),
        start: z.number().int(),
        nextPageStart: z.number().int().optional(),
        isLastPage: z.boolean(),
        values: z.array(
            z
                .object({
                    id: z.string(),
                    displayId: z.string(),
                    type: z.string(),
                    latestCommit: z.string(),
                    isDefault: z.boolean(),
                    metadata: z
                        .object({
                            'com.atlassian.bitbucket.server.bitbucket-branch:ahead-behind-metadata-provider': z
                                .object({
                                    ahead: z.number().int(),
                                    behind: z.number().int(),
                                })
                                .nonstrict()
                                .optional(),
                            'com.atlassian.bitbucket.server.bitbucket-branch:latest-commit-metadata': z
                                .object({
                                    id: z.string(),
                                    displayId: z.string(),
                                    author: userTypeGuard,
                                    authorTimestamp: z.number().int(),
                                    message: z.string(),
                                })
                                .nonstrict()
                                .optional(),
                        })
                        .nonstrict(),
                })
                .nonstrict()
        ),
    })
    .nonstrict();

export type branchesWithDetailsType = z.infer<typeof branchesWithDetailsTypeGuard>;
