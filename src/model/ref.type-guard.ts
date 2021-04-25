import * as z from 'zod';
import { repositoryTypeGuard } from './repository.type-guard';

export const refTypeGuard = z
    .object({
        id: z.string(),
        displayId: z.string(),
        latestCommit: z.string(),
        repository: repositoryTypeGuard,
    })
    .nonstrict();
