import * as z from 'zod';

export const hostDataTypeGuard = z.object({
    hostName: z.string(),
    auth: z.object({
        username: z.string(),
        password: z.string(),
    }),
});

export type HostData = z.infer<typeof hostDataTypeGuard>;
