import { IncomingMessage } from 'http';
import { log } from '../shared/logger';
import { IHostInfo } from '../shared/model/host-info.interface';
import { IRepoInfo } from '../shared/model/repo-info.interface';
import { validateOrThrow } from '../shared/validate-or-throw';
import { BranchDataType, BranchesResponseType, BranchesResponseTypeGuard } from './model/branches-response';

const https = require('https');

export interface IBranchInfo {
    branchName: string;
    commitsAheadOfDevelop: number | null;
    commitsBehindDevelop: number | null;
    author: string | null;
    authorEmail: string | null;
    lastCommitDateAsIsoString: string | null;
}

export class BranchInfoUtil {
    public getAllBranches(hostInfo: IHostInfo, repoInfo: IRepoInfo, callback: (branchesInfo: IBranchInfo[]) => void): void {
        this.getAllBranchesRecursively(hostInfo, repoInfo, [], 0, (branchData: BranchDataType[]) => {
            const branchesInfo: IBranchInfo[] = branchData.map(singleBranchData => {
                const aheadBehindObj =
                    singleBranchData.metadata['com.atlassian.bitbucket.server.bitbucket-branch:ahead-behind-metadata-provider'];
                const committerObj = singleBranchData.metadata['com.atlassian.bitbucket.server.bitbucket-branch:latest-commit-metadata'];
                return {
                    author: committerObj ? committerObj.author.name : null,
                    authorEmail: committerObj ? committerObj.author.emailAddress : null,
                    branchName: singleBranchData.displayId,
                    commitsAheadOfDevelop: aheadBehindObj ? aheadBehindObj.ahead : null,
                    commitsBehindDevelop: aheadBehindObj ? aheadBehindObj.behind : null,
                    lastCommitDateAsIsoString: committerObj ? new Date(committerObj.committerTimestamp).toISOString() : null
                };
            });
            callback(branchesInfo);
        });
    }

    private getAllBranchesRecursively(
        hostInfo: IHostInfo,
        repoInfo: IRepoInfo,
        branchData: BranchDataType[],
        currentPageStart: number,
        callback: (branchData: BranchDataType[]) => void
    ) {
        this.getBranchesPaged(hostInfo, repoInfo, 'develop', currentPageStart, 20, (bitbucketResponse: BranchesResponseType) => {
            // Callback is invoked after the first batch of branches is fetched
            branchData.push(...bitbucketResponse.values);
            if (bitbucketResponse.isLastPage) {
                // If we're done, invoke the result callback
                log('INFO', `fetched ${currentPageStart} to ${branchData.length}, done!`);
                callback(branchData);
                return;
            }
            // Otherwise, if we're not done yet, continue recursively
            log('INFO', `fetched ${currentPageStart} to ${currentPageStart + 20}...`);
            this.getAllBranchesRecursively(hostInfo, repoInfo, branchData, currentPageStart + 20, callback);
        });
    }

    private getBranchesPaged(
        hostInfo: IHostInfo,
        repoInfo: IRepoInfo,
        baseBranch: string,
        pageStart: number,
        pageSize: number,
        callback: (receivedData: BranchesResponseType) => void
    ) {
        const httpGetOptions = {
            host: hostInfo.host,
            path: `/rest/api/1.0/projects/${repoInfo.projectSlug}/repos/${repoInfo.repoSlug}/branches?base=${baseBranch}&details=true&orderBy=MODIFICATION&context=%7B%22withMessages%22%3Afalse%7D&start=${pageStart}&limit=${pageSize}`,
            auth: `${hostInfo.username}:${hostInfo.password}`
        };
        https
            .get(httpGetOptions, (resp: IncomingMessage) => {
                const { statusCode } = resp;
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', chunk => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    if (statusCode === 200) {
                        const receivedData = JSON.parse(data);
                        callback(validateOrThrow<BranchesResponseType>(BranchesResponseTypeGuard.decode(receivedData)));
                        return;
                    }
                    log('ERROR', `Invalid status code: ${statusCode}, received content:\n${data}`);
                    process.exit(1);
                });
            })
            .on('error', (err: Error) => {
                log('ERROR', '[GET-REQUEST] Error: ' + err.message);
                process.exit(1);
            });
    }
}
