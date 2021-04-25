import { expect } from 'chai';
import { getIntegrationTestConfig } from '../../setup/integration-test-config';
import { getPrData } from '../../../src/api/pull-requests/get-pr-data';

describe('get-pr-data', () => {
    it('should fetch data about a pull-request from the API', (done) => {
        const integrationTestConfig = getIntegrationTestConfig();
        getPrData(
            integrationTestConfig.hostData,
            integrationTestConfig.repoData,
            integrationTestConfig.validPullRequestNumber,
            (response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body.id).to.equal(integrationTestConfig.validPullRequestNumber);
                done();
            }
        );
    });
});
