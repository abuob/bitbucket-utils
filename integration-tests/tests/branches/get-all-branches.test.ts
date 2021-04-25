import { expect } from 'chai';
import { getIntegrationTestConfig } from '../../setup/integration-test-config';
import { getAllBranchesWithDetails, getBranchesWithDetailsPaginated } from '../../../src/api/branches/get-all-branches';

describe('get-all-branches', () => {
    it('should fetch a single "page" of all branches', (done) => {
        const integrationTestConfig = getIntegrationTestConfig();
        getBranchesWithDetailsPaginated(integrationTestConfig.hostData, integrationTestConfig.repoData, 0, 25, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.values).to.have.length(25);
            done();
        });
    });

    it('should fetch data about all branches, using paginated requests recursively', (done) => {
        const integrationTestConfig = getIntegrationTestConfig();
        getAllBranchesWithDetails(integrationTestConfig.hostData, integrationTestConfig.repoData, (response) => {
            expect(response.statusCode).to.equal(200);
            done();
        });
    }).timeout(10000);
});
