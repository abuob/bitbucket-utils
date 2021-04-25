import * as z from 'zod';
import { repositoryDataTypeGuard } from '../../src/model/infrastructure/repository-data';
import { hostDataTypeGuard } from '../../src/model/infrastructure/host-data';
import integrationTestConfigJson from '../../integration-test-config.json';

const integrationTestConfigTypeGuard = z.object({
    repoData: repositoryDataTypeGuard,
    hostData: hostDataTypeGuard,
    mainBranch: z.string(),
    validPullRequestNumber: z.number().int(),
});

type IntegrationTestConfigType = z.infer<typeof integrationTestConfigTypeGuard>;

/**
 * The method expects the .gitignored file '../../integration-test-config.json' to exist
 * and contain data of the format as described and asserted by "integrationTestConfigTypeGuard".
 */
export function getIntegrationTestConfig(): IntegrationTestConfigType {
    console.assert(
        !!integrationTestConfigJson,
        `
                It seems there was no "integration-test-config.json" on the root-level of this repo.
                Please provide one containing all the necessary data to execute the integration-tests`
    );
    return integrationTestConfigTypeGuard.parse(integrationTestConfigJson);
}
