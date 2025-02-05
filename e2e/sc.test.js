import SauceLabs from '../build';

const ID = process.env.GITHUB_RUN_ID ?? '(local)';
// Only run the test when the env var is present
// in GitHub Actions, otherwise it fails for untrusted PRs
const SKIP_TEST = process.env.GITHUB_RUN_ID && !process.env.SAUCE_USERNAME;

jest.setTimeout(120 * 1000); // 120s should be sufficient to run all SC tests

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

test('should be able to get Sauce Connect versions', async () => {
  if (SKIP_TEST) {
    return;
  }
  const api = new SauceLabs();
  const response = await api.scDownload({
    version: '5.2.2',
    arch: 'arm64',
    os: 'macos',
  });

  expect(response.download.version).toEqual('5.2.2');
  expect(response.download.url).toMatch(/5\.2\.2/);
  console.log(response.download.url);
});

test('should not be able to run Sauce Connect due to invalid credentials', async () => {
  if (SKIP_TEST) {
    return;
  }
  const api = new SauceLabs({key: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'});
  const err = await api
    .startSauceConnect({
      logger: console.log.bind(console),
      tunnelName: `node-saucelabs E2E test - ${ID}`,
    })
    .catch((err) => err);
  expect(err.message).toContain(
    'Sauce Connect exited before reaching a ready state'
  );
});

test('should not be able to run Sauce Connect due to missing tunnel-name', async () => {
  if (SKIP_TEST) {
    return;
  }
  const api = new SauceLabs();
  const err = await api
    .startSauceConnect({
      logger: console.log.bind(console),
    })
    .catch((err) => err);
  expect(err.message).toContain('Missing tunnel-name');
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
