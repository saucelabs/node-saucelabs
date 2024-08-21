import SauceLabs from '../build';
// import SauceLabs from 'saucelabs';

// Only run the test when the env var is present
// in GitHub Actions, otherwise it fails for untrusted PRs
const SKIP_TEST = process.env.GITHUB_RUN_ID && !process.env.SAUCE_USERNAME;

jest.setTimeout(60 * 1000); // 60s should be sufficient to boot SC

/**
 * unmock
 */
jest.unmock('https').unmock('got').unmock('yargs');

test('should receive 400', async () => {
  if (SKIP_TEST) {
    return;
  }
  const api = new SauceLabs();
  await expect(
    api.listJobs(process.env.SAUCE_USERNAME, {
      limit: 1,
      autoOnly: true,
      manualOnly: true,
    })
  ).rejects.toThrow(
    'Failed calling listJobs: Response code 400 (Bad Request), {"message":"Invalid combination of arguments."}'
  );
});

test('should be able to list automated jobs', async () => {
  if (SKIP_TEST) {
    return;
  }
  const api = new SauceLabs();
  await api.listJobs(process.env.SAUCE_USERNAME, {
    limit: 1,
    autoOnly: true,
  });
});

test('should be able to list live-testing jobs', async () => {
  if (SKIP_TEST) {
    return;
  }
  const api = new SauceLabs();
  await api.listJobs(process.env.SAUCE_USERNAME, {
    limit: 1,
    manualOnly: true,
  });
});
