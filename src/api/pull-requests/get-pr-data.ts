import { HostData } from '../../model/infrastructure/host-data';
import { RepositoryData } from '../../model/infrastructure/repository-data';
import { HttpResponse, httpsCallbackHandler } from '../../util/https-callback-handler';
import { prDataType, prDataTypeGuard } from './pr-data.type-guard';
import { RequestOptions } from 'https';

const https = require('https');

export function getPrData(
    hostData: HostData,
    repositoryData: RepositoryData,
    prNumber: number,
    callback: (response: HttpResponse<prDataType>) => void
): void {
    const httpGetOptions: RequestOptions = {
        host: hostData.hostName,
        path: `/rest/api/1.0/projects/${repositoryData.projectSlug}/repos/${repositoryData.repositorySlug}/pull-requests/${prNumber}`,
        auth: `${hostData.auth.username}:${hostData.auth.password}`,
    };
    https.get(httpGetOptions, httpsCallbackHandler(prDataTypeGuard, callback));
}
