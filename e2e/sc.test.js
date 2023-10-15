import SauceLabs from '../build';

const ID = process.env.GITHUB_RUN_ID ?? '(local)';
// Only run the test when the env var is present
// in GitHub Actions, otherwise it fails for untrusted PRs
const SKIP_TEST = process.env.GITHUB_RUN_ID && !process.env.SAUCE_USERNAME;

jest.setTimeout(60 * 1000); // 60s should be sufficient to boot SC

/**
 * unmock
 */
jest
  .unmock('https')
  .unmock('form-data')
  .unmock('got')
  .unmock('yargs')
  .unmock('compressing')
  .unmock('zlib');

test('should not be able to run Sauce Connect due to invalid credentials', async () => {
  if (SKIP_TEST) {
    return;
  }
  const api = new SauceLabs({key: 'foobar'});
  const err = await api
    .startSauceConnect({
      logger: console.log.bind(console),
      tunnelName: `node-saucelabs E2E test - ${ID}`,
    })
    .catch((err) => err);
  expect(err.message).toContain('Unauthorized');
});

test('should be able to run Sauce Connect', async () => {
  if (SKIP_TEST) {
    return;
  }
  const api = new SauceLabs();
  const sc = await api.startSauceConnect({
    logger: console.log.bind(console),
    // tunnelPool is set here in order for the concurrent tests to not shut down "colliding" tunnels.
    tunnelPool: true,
    tunnelName: `node-saucelabs E2E test - ${ID}`,
  });
  console.log('Sauce Connect started successfully, shutting down...');
  await sc.close();
});

afterAll(async () => {
  // this is here because for whatever reason, we're logging output from
  // sc _after_ sc.close() has fulfilled. this is disallowed by jest, for whatever reason
  await new Promise((resolve) => setTimeout(resolve, 5000));
});
