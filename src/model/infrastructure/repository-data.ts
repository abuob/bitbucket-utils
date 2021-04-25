import * as z from 'zod';

export const repositoryDataTypeGuard = z.object({
    projectSlug: z.string(),
    repositorySlug: z.string(),
});

export type RepositoryData = z.infer<typeof repositoryDataTypeGuard>;
