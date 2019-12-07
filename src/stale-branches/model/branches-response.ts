import * as t from 'io-ts';

const CommitterTypeGuard = t.type({
    name: t.string,
    emailAddress: t.string
});

const metadataTypeGuard = t.partial({
    'com.atlassian.bitbucket.server.bitbucket-branch:ahead-behind-metadata-provider': t.type({
        ahead: t.number,
        behind: t.number
    }),
    'com.atlassian.bitbucket.server.bitbucket-branch:latest-commit-metadata': t.type({
        id: t.string,
        displayId: t.string,
        author: CommitterTypeGuard,
        authorTimestamp: t.number,
        committer: CommitterTypeGuard,
        committerTimestamp: t.number
    })
});

const BranchDataTypeGuard = t.type({
    displayId: t.string,
    latestCommit: t.string,
    isDefault: t.boolean,
    metadata: metadataTypeGuard
});
export type BranchDataType = t.TypeOf<typeof BranchDataTypeGuard>;

export const BranchesResponseTypeGuard = t.type({
    isLastPage: t.boolean,
    values: t.array(BranchDataTypeGuard)
});
export type BranchesResponseType = t.TypeOf<typeof BranchesResponseTypeGuard>;
