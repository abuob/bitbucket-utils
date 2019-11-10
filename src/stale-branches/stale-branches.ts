import { IncomingMessage } from 'http';
import { log } from '../shared/logger';
import { IHostInfo } from '../shared/model/host-info.interface';
import { IRepoInfo } from '../shared/model/repo-info.interface';
import { validateOrThrow } from '../shared/validate-or-throw';
import { BranchesResponseType, BranchesResponseTypeGuard, BranchInfoType } from './model/branches-response';

const https = require('https');

export function getAllBranches(
    hostInfo: IHostInfo,
    repoInfo: IRepoInfo,
    branchData: BranchInfoType[],
    currentPageStart: number,
    callback: (branchData: BranchInfoType[]) => void
) {
    getBranchesPaged(hostInfo, repoInfo, 'develop', currentPageStart, 20, (bitbucketResponse: BranchesResponseType) => {
        branchData.push(...bitbucketResponse.values);
        if (bitbucketResponse.isLastPage) {
            log('INFO', `fetched ${currentPageStart} to ${branchData.length}, done!`);
            callback(branchData);
            return;
        }
        log('INFO', `fetched ${currentPageStart} to ${currentPageStart + 20}...`);
        getAllBranches(hostInfo, repoInfo, branchData, currentPageStart + 20, callback);
    });
}

function getBranchesPaged(
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
