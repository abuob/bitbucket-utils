import * as t from 'io-ts';

const BranchInfoTypeGuard = t.type({
    displayId: t.string,
    latestCommit: t.string,
    isDefault: t.boolean
});
export type BranchInfoType = t.TypeOf<typeof BranchInfoTypeGuard>;

export const BranchesResponseTypeGuard = t.type({
    isLastPage: t.boolean,
    values: t.array(BranchInfoTypeGuard)
});
export type BranchesResponseType = t.TypeOf<typeof BranchesResponseTypeGuard>;
