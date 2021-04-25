import { HostData } from '../../model/infrastructure/host-data';
import { RepositoryData } from '../../model/infrastructure/repository-data';
import { RequestOptions } from 'https';
import { HttpResponse, httpsCallbackHandler } from '../../util/https-callback-handler';
import { branchesWithDetailsType, branchesWithDetailsTypeGuard } from './branches-with-details.type-guard';

const https = require('https');

export function getAllBranchesWithDetails(
    hostData: HostData,
    repositoryData: RepositoryData,
    callback: (response: HttpResponse<branchesWithDetailsType>) => void
): void {
    getAllBranchesWithDetailsRecursively(
        hostData,
        repositoryData,
        0,
        25,
        [],
        (responses: HttpResponse<branchesWithDetailsType>[]): void => {
            const allBranchDetails: branchesWithDetailsType['values'] = responses
                .map((response) => response.body.values)
                .reduce(
                    (prev: branchesWithDetailsType['values'], curr: branchesWithDetailsType['values']): branchesWithDetailsType['values'] =>
                        prev.concat(curr),
                    []
                );
            callback({
                statusCode: 200,
                body: {
                    isLastPage: true,
                    limit: allBranchDetails.length,
                    size: allBranchDetails.length,
                    start: 0,
                    values: allBranchDetails,
                },
            });
        }
    );
}

function getAllBranchesWithDetailsRecursively(
    hostData: HostData,
    repositoryData: RepositoryData,
    pageStart: number,
    pageSize: number,
    alreadyObtainedPages: HttpResponse<branchesWithDetailsType>[],
    callback: (responses: HttpResponse<branchesWithDetailsType>[]) => void
): void {
    getBranchesWithDetailsPaginated(hostData, repositoryData, pageStart, pageSize, (response: HttpResponse<branchesWithDetailsType>) => {
        if (response.body.isLastPage) {
            callback(alreadyObtainedPages.concat(response));
        } else {
            getAllBranchesWithDetailsRecursively(
                hostData,
                repositoryData,
                pageStart + pageSize,
                pageSize,
                alreadyObtainedPages.concat(response),
                callback
            );
        }
    });
}

export function getBranchesWithDetailsPaginated(
    hostData: HostData,
    repositoryData: RepositoryData,
    pageStart: number,
    pageSize: number,
    callback: (response: HttpResponse<branchesWithDetailsType>) => void
): void {
    const httpGetOptions: RequestOptions = {
        host: hostData.hostName,
        path: `/rest/api/1.0/projects/${repositoryData.projectSlug}/repos/${repositoryData.repositorySlug}/branches?limit=${pageSize}&start=${pageStart}&details=true`,
        auth: `${hostData.auth.username}:${hostData.auth.password}`,
    };
    https.get(httpGetOptions, httpsCallbackHandler(branchesWithDetailsTypeGuard, callback));
}
