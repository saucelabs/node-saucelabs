import {MockAgent} from 'undici';
import util from 'util';
import {spawn} from 'child_process';
import FormData from 'form-data';

import SauceLabs from '../src';

import downloadMacos from './__responses__/download_macos.json';
import downloadWindows from './__responses__/download_windows_x86_64.json';
import downloadError from './__responses__/download_error.json';

const instances = [];

jest.mock('fs');
const fs = require('fs');
fs.promises = {
  stat: jest.fn().mockReturnValue(Promise.resolve({size: 123})),
};

jest.mock('child_process', () => {
  const EventEmitter = require('events');
  const stdoutEmitter = new EventEmitter();
  const stderrEmitter = new EventEmitter();
  const spawnMock = {
    pid: 123,
    stderr: stderrEmitter,
    stdout: stdoutEmitter,
    on: jest.fn(),
  };
  const spawn = jest.fn().mockReturnValue(spawnMock);
  return {spawn};
});

jest.mock('../src/sauceConnectLoader.js', () => {
  class SauceConnectLoaderMock {
    constructor() {
      (this.verifyAlreadyDownloaded = jest
        .fn()
        .mockReturnValue(Promise.resolve())),
        (this.path = '/foo/bar');
      instances.push(this);
    }
  }

  return SauceConnectLoaderMock;
});

jest.mock('../src/sauceConnectHealthcheck.js', () => {
  class SauceConnectHealthcheckMock {
    constructor() {
      this.perform = jest.fn().mockResolvedValue(undefined);
    }
  }

  return SauceConnectHealthcheckMock;
});

jest.mock('../src/constants.js', () => ({
  ...jest.requireActual('../src/constants.js'),
  SC_CLOSE_TIMEOUT: 10,
}));

const stdoutEmitter = spawn().stdout;
const stderrEmitter = spawn().stderr;
const origKill = process.kill;

/**
 * fresh MockAgent per test, injected via the constructor's undocumented
 * `dispatcher` option (see src/index.js) since the constructor returns a
 * Proxy over a plain object, not `this` - there's no `_dispatcher` field
 * reachable from outside once a SauceLabs instance is built.
 */
let mockAgent;
let apiPool;
let assetsPool;

function createApi(options) {
  return new SauceLabs({...options, dispatcher: mockAgent});
}

beforeEach(() => {
  spawn.mockClear();
  process.kill = jest.fn();
  instances.splice(0, instances.length);

  mockAgent = new MockAgent();
  mockAgent.disableNetConnect();
  apiPool = mockAgent.get('https://api.us-west-1.saucelabs.com');
  assetsPool = mockAgent.get('https://assets.saucelabs.com');
});

afterEach(async () => {
  fs.writeFileSync.mockClear();
  process.kill = origKill;
  await mockAgent.close();
});

test('should be inspectable', () => {
  const api = new SauceLabs({user: 'foo', key: 'bar'});
  /**
   * we can't use snapshotting here as the result varies
   * between different node versions
   */
  expect(util.inspect(api)).toContain(`{
  username: 'foo',
  key: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXbar',
  region: 'us',
  proxy: undefined`);
});

test('should expose a webdriverEndpoint', () => {
  const api = new SauceLabs({user: 'foo', key: 'bar'});
  expect(api.webdriverEndpoint).toBe(
    'https://ondemand.us-west-1.saucelabs.com/'
  );

  const api2 = new SauceLabs({user: 'foo', key: 'bar', region: 'eu'});
  expect(api2.webdriverEndpoint).toBe(
    'https://ondemand.eu-central-1.saucelabs.com/'
  );

  const api3 = new SauceLabs({
    user: 'foo',
    key: 'bar',
    region: 'us-east-4',
  });
  expect(api3.webdriverEndpoint).toBe(
    'https://ondemand.us-east-4.saucelabs.com/'
  );

  const api4 = new SauceLabs({user: 'foo', key: 'bar', region: 'us-central-3'});
  expect(api4.webdriverEndpoint).toBe(
    'https://ondemand.us-central-3.saucelabs.com/'
  );
});

test('should have to string tag', () => {
  expect(
    Object.prototype.toString.call(new SauceLabs({user: 'foo', key: 'bar'}))
  ).toBe('[object SauceLabs API Client]');
});

test('should not provide an iterator', () => {
  const api = new SauceLabs({user: 'foo', key: 'bar'});
  expect(() => [...api]).toThrow('is not iterable');
});

test('should return public properties', () => {
  const api = new SauceLabs({user: 'foo', key: 'bar'});
  expect(api.region).toBe('us');
  expect(api.username).toBe('foo');
  expect(api._accessKey).toBe(undefined);
});

test('should return nothing if Symbol was accessed', () => {
  const sym = Symbol('foo');
  const api = new SauceLabs({user: 'foo', key: 'bar'});
  expect(typeof api[sym]).toBe('undefined');
});

test('should grab username and access key from env variable', () => {
  jest.resetModules();
  process.env.SAUCE_USERNAME = 'barfoo';
  process.env.SAUCE_ACCESS_KEY = 'foobar';
  const SauceLabsNew = require('../src').default;
  const api = new SauceLabsNew();
  expect(util.inspect(api)).toContain("username: 'barfoo'");
  expect(util.inspect(api)).toContain(
    "key: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXfoobar'"
  );
});

test('should grab http proxy from env variable', () => {
  jest.resetModules();
  process.env.HTTP_PROXY = 'http://my.proxy.com:8080';
  const SauceLabsNew = require('../src').default;
  const api = new SauceLabsNew();
  expect(util.inspect(api)).toMatch(/proxy: '??http:\/\/my\.proxy\.com:8080/);
  delete process.env.HTTP_PROXY;
});

test('should grab https proxy from env variable', () => {
  jest.resetModules();
  process.env.HTTPS_PROXY = 'https://my.proxy.com:443';
  const SauceLabsNew = require('../src').default;
  const api = new SauceLabsNew();
  expect(util.inspect(api)).toMatch(/proxy: '??https:\/\/my\.proxy\.com:443/);
});

test('should throw if API command is unknown', () => {
  const api = new SauceLabs({user: 'foo', key: 'bar'});
  expect(() => api.doSomethingCool(123, {foo: 'bar'})).toThrow(
    'Couldn\'t find API endpoint for command "doSomethingCool"'
  );
});

test('should allow to call an API method with param in url', async () => {
  apiPool
    .intercept({path: '/rest/v1.2/users/someuser/concurrency', method: 'GET'})
    .reply(200, {});
  const api = createApi({user: 'foo', key: 'bar'});
  await expect(api.getUserConcurrency('someuser')).resolves.toEqual({});
});

test('should allow to call an API method with param as option', async () => {
  apiPool
    .intercept({
      path: '/rest/v1.1/someuser/jobs',
      method: 'GET',
      query: {limit: 123, full: true},
    })
    .reply(200, {});
  const api = createApi({user: 'foo', key: 'bar'});
  await expect(
    api.listJobs('someuser', {limit: 123, full: true})
  ).resolves.toEqual({});
});

test('should allow to make a request with body param', async () => {
  apiPool
    .intercept({
      path: '/rest/v1/foobaruser/jobs/690c5877710c422d8be4c622b40c747f',
      method: 'PUT',
    })
    .reply((opts) => {
      expect(JSON.parse(opts.body)).toEqual({passed: true});
      return {statusCode: 200, data: JSON.stringify({})};
    });
  const api = createApi({user: 'foo', key: 'bar'});
  await api.updateJob('foobaruser', '690c5877710c422d8be4c622b40c747f', {
    passed: true,
  });
});

test('should allow to make a request with body param via CLI call', async () => {
  apiPool
    .intercept({
      path: '/rest/v1/foobaruser/jobs/690c5877710c422d8be4c622b40c747f',
      method: 'PUT',
    })
    .reply((opts) => {
      expect(JSON.parse(opts.body)).toEqual({passed: false});
      return {statusCode: 200, data: JSON.stringify({})};
    });
  const api = createApi({user: 'foo', key: 'bar'});
  await api.updateJob(
    'foobaruser',
    '690c5877710c422d8be4c622b40c747f',
    '{ "passed": false }'
  );
});

test('should fail if param has wrong type', async () => {
  const api = new SauceLabs({user: 'foo', key: 'bar'});
  const error = await api
    .listJobs(123, {
      limit: 123,
      full: true,
    })
    .catch((err) => err);
  expect(error.message).toBe(
    "Expected parameter for url param 'username' from type 'string', found 'number'"
  );
});

test('should fail if option has wrong type', async () => {
  const api = new SauceLabs({user: 'foo', key: 'bar'});
  const error = await api
    .listJobs('someuser', {
      limit: '123',
      full: true,
    })
    .catch((err) => err);
  expect(error.message).toBe(
    "Expected parameter for option 'limit' from type 'number', found 'string'"
  );
});

test('should handle error case', async () => {
  apiPool
    .intercept({
      path: '/rest/v1.1/someuser/jobs',
      method: 'GET',
      query: {limit: 123, full: true},
    })
    .reply(404, {message: 'Not Found'});
  const api = createApi({user: 'foo', key: 'bar'});
  const error = await api
    .listJobs('someuser', {
      limit: 123,
      full: true,
    })
    .catch((err) => err);
  expect(error.message).toContain(
    'Failed calling listJobs: Response code 404 (Not Found)'
  );
});

test('should be able to download assets', async () => {
  assetsPool
    .intercept({
      path: (path) => path.startsWith('/jobs/some-id/performance.json'),
      method: 'GET',
    })
    .reply((opts) => {
      expect(opts.path).toContain('auth=a2600100e3d1990721be97c093f64567');
      return {statusCode: 200, data: ''};
    });
  const api = createApi({user: 'foo', key: 'bar'});
  await api.downloadJobAsset('some-id', 'performance.json');
});

test('should handle errors when downloading assets', async () => {
  assetsPool
    .intercept({
      path: (path) => path.startsWith('/jobs/some-id/performance.json'),
      method: 'GET',
    })
    .reply(404, {message: 'Not Found'});

  const api = createApi({user: 'foo', key: 'bar'});
  const error = await api
    .downloadJobAsset('some-id', 'performance.json')
    .catch((err) => err);
  expect(error.message).toBe(
    'There was an error downloading asset performance.json: Response code 404 (Not Found)'
  );
});

test('should parse text responses if headers expect json', async () => {
  const reqRespond = {foo: 'bar'};
  assetsPool
    .intercept({
      path: (path) => path.startsWith('/jobs/some-id/performance.json'),
      method: 'GET',
    })
    .reply(200, JSON.stringify(reqRespond), {
      headers: {'content-type': 'application/json'},
    });
  const api = createApi({user: 'foo', key: 'bar'});
  const result = await api.downloadJobAsset('some-id', 'performance.json');
  expect(result).toEqual(reqRespond);
});

test('should fail if parameters are not given properly', async () => {
  const api = new SauceLabs({user: 'foo', key: 'bar'});
  const error = new Error(
    'You need to define a job id and the file name of the asset as a string'
  );
  await expect(api.downloadJobAsset()).rejects.toEqual(error);
  await expect(api.downloadJobAsset('foo')).rejects.toEqual(error);
  await expect(api.downloadJobAsset(123, 'bar')).rejects.toEqual(error);
});

test('should support proxy options', async () => {
  const proxy = 'http://my.proxy.com:8080';
  assetsPool
    .intercept({
      path: (path) => path.startsWith('/jobs/some-id/performance.json'),
      method: 'GET',
    })
    .reply(200, '');
  const api = createApi({user: 'foo', key: 'bar', proxy});
  expect(api.proxy).toBe(proxy);
  await expect(
    api.downloadJobAsset('some-id', 'performance.json')
  ).resolves.toBeDefined();
});

test('should put asset into file as binary', async () => {
  assetsPool
    .intercept({
      path: (path) => path.startsWith('/jobs/some-id/video.mp4'),
      method: 'GET',
    })
    .reply(200, Buffer.from('binary-video-data'));
  const api = createApi({user: 'foo', key: 'bar'});
  await api.downloadJobAsset('some-id', 'video.mp4', {
    filepath: '/asset.json',
  });
  expect(fs.writeFileSync).toBeCalledWith(
    '/asset.json',
    Buffer.from('binary-video-data'),
    {encoding: 'binary'}
  );
});

test('should put asset into file as json file', async () => {
  assetsPool
    .intercept({
      path: (path) => path.startsWith('/jobs/some-id/performance.json'),
      method: 'GET',
    })
    .reply(200, JSON.stringify({foo: 'bar'}), {
      headers: {'content-type': 'application/json'},
    });
  const api = createApi({user: 'foo', key: 'bar'});
  await api.downloadJobAsset('some-id', 'performance.json', {
    filepath: '/asset.json',
  });
  expect(fs.writeFileSync).toBeCalledWith(
    '/asset.json',
    JSON.stringify({foo: 'bar'}, null, 4),
    {encoding: 'utf8'}
  );
});

test('should allow to upload files', async () => {
  fs.createReadStream.mockReturnValue({
    name: '/somefile',
    path: 'somepath',
  });

  const body = {foo: 'bar'};
  apiPool
    .intercept({
      path: '/v1/testcomposer/jobs/some-id/assets',
      method: 'PUT',
    })
    .reply(200, JSON.stringify(body), {
      headers: {'content-type': 'application/json'},
    });

  const api = createApi({user: 'foo', key: 'bar'});
  const result = await api.uploadJobAssets('some-id', {
    files: [
      'log.json',
      'selenium-server.json',
      {
        filename: 'raw-file.json',
        data: Buffer.from('my-raw-data', 'utf8'),
      },
      {
        filename: 'foobar.json',
        data: {foo: 'bar'},
      },
    ],
  });

  const {instances} = new FormData();
  expect(instances[0].append).toBeCalledTimes(4);
  expect(instances[0].append).toBeCalledWith(
    'file[]',
    {name: '/somefile', path: 'somepath'},
    {
      contentType: 'text/plain',
      filename: 'log.json',
      filepath: expect.any(String),
      knownLength: 123,
    }
  );
  expect(instances[0].append).toBeCalledWith(
    'file[]',
    Buffer.from('my-raw-data', 'utf8'),
    'raw-file.json'
  );
  expect(instances[0].append).toBeCalledWith(
    'file[]',
    Buffer.from(JSON.stringify({foo: 'bar'})),
    'foobar.json'
  );

  expect(result).toEqual(body);
});

test('should throw if custom error if upload fails', async () => {
  fs.createReadStream.mockReturnValue({
    name: '/somefile',
    path: 'somepath',
  });

  apiPool
    .intercept({
      path: '/v1/testcomposer/jobs/some-id/assets',
      method: 'PUT',
    })
    .replyWithError(new Error('uups'));

  const api = createApi({user: 'foo', key: 'bar'});
  const result = await api
    .uploadJobAssets('some-id', {
      files: ['log.json', '/selenium-server.json'],
    })
    .catch((err) => err);

  expect(result.message).toBe('There was an error uploading assets: uups');
});

test('should not even try to upload if no files were selected', async () => {
  const api = new SauceLabs({user: 'foo', key: 'bar'});
  const result = await api.uploadJobAssets('some-id').catch((err) => err);

  expect(result.message).toBe('No files to upload selected');
});

test('should fail if file parameter is invalid', async () => {
  const api = new SauceLabs({user: 'foo', key: 'bar'});
  const result = await api
    .uploadJobAssets('some-id', {
      files: [{foo: 'bar'}],
    })
    .catch((err) => err);

  expect(result.message).toContain('Invalid file parameter');
});

test('should contain expected macos download link', async () => {
  apiPool
    .intercept({
      path: (p) =>
        p.startsWith('/rest/v1/public/tunnels/sauce-connect/download'),
      method: 'GET',
      query: {version: '5.2.2', os: 'macos', arch: 'x86_64'},
    })
    .reply(200, downloadMacos);
  const api = createApi({user: 'foo', key: 'bar'});
  const scDownload = await api.scDownload({
    version: '5.2.2',
    os: 'macos',
    arch: 'x86_64',
  });
  expect(scDownload.download).toMatchObject({
    checksums: [
      {
        value:
          '1384bb85b2d29d177933fc8e894c8f6ac60d83b666435d12e9fca7f50b350459',
        algorithm: 'sha256',
      },
    ],
    url: 'https://saucelabs.com/downloads/sauce-connect/5.2.2/sauce-connect-5.2.2_darwin.all.zip',
    version: '5.2.2',
  });
});

test('should contain expected windows download link', async () => {
  apiPool
    .intercept({
      path: (p) =>
        p.startsWith('/rest/v1/public/tunnels/sauce-connect/download'),
      method: 'GET',
      query: {version: '5.2.2', os: 'windows', arch: 'x86_64'},
    })
    .reply(200, downloadWindows);
  const api = createApi({user: 'foo', key: 'bar'});
  const scDownload = await api.scDownload({
    version: '5.2.2',
    os: 'windows',
    arch: 'x86_64',
  });
  expect(scDownload.download).toMatchObject({
    checksums: [
      {
        value:
          'fb932db5af5c4ed3dbdae9c939ae77da5d9440a3b0de60701643518af7b53ff1',
        algorithm: 'sha256',
      },
    ],
    url: 'https://saucelabs.com/downloads/sauce-connect/5.2.2/sauce-connect-5.2.2_windows.x86_64.zip',
    version: '5.2.2',
  });
});

describe('startSauceConnect', () => {
  it('should start sauce connect with proper parsed args', async () => {
    const logs = [];
    apiPool
      .intercept({
        path: (p) =>
          p.startsWith('/rest/v1/public/tunnels/sauce-connect/download'),
        method: 'GET',
      })
      .reply(200, downloadMacos);
    const api = createApi({
      user: 'foo',
      key: 'bar',
      proxy: 'http://example.com',
    });
    setTimeout(
      () =>
        stdoutEmitter.emit(
          'data',
          'Sauce Connect is up, you may start your tests'
        ),
      50
    );
    await api.startSauceConnect({
      scVersion: '1.2.3',
      tunnelName: 'my-tunnel',
      'proxy-tunnel': 'abc',
      metadata: 'runner=example',
      verbose: true,
      region: 'eu',
      scUpstreamProxy: 'http://example.com:8080',
      logger: (log) => logs.push(log),
    });
    expect(spawn).toBeCalledTimes(1);
    expect(spawn.mock.calls).toMatchSnapshot();

    expect(logs).toHaveLength(1);
    expect(instances).toHaveLength(2);
  });

  it('should throw an error if there is an error response from the download API', async () => {
    const logs = [];
    apiPool
      .intercept({
        path: (p) =>
          p.startsWith('/rest/v1/public/tunnels/sauce-connect/download'),
        method: 'GET',
      })
      .reply(200, downloadError);
    const api = createApi({user: 'foo', key: 'bar'});
    const err = await api
      .startSauceConnect({
        tunnelName: 'my-tunnel',
        'proxy-tunnel': 'abc',
        logger: (log) => logs.push(log),
      })
      .catch((err) => err);
    expect(err.message).toContain('code: 404 message: Invalid input');
  });

  it('should throw an error if there is an invalid response from the download API', async () => {
    const logs = [];
    apiPool
      .intercept({
        path: (p) =>
          p.startsWith('/rest/v1/public/tunnels/sauce-connect/download'),
        method: 'GET',
      })
      .reply(200, {}); // empty response
    const api = createApi({user: 'foo', key: 'bar'});
    const err = await api
      .startSauceConnect({
        tunnelName: 'my-tunnel',
        'proxy-tunnel': 'abc',
        logger: (log) => logs.push(log),
      })
      .catch((err) => err);
    expect(err.message).toBe('Failed to retrieve Sauce Connect download.');
  });

  it('should throw an error if the call to the download API failed', async () => {
    const logs = [];
    apiPool
      .intercept({
        path: (p) =>
          p.startsWith('/rest/v1/public/tunnels/sauce-connect/download'),
        method: 'GET',
      })
      .replyWithError(new Error('Endpoint not available!'));
    const api = createApi({user: 'foo', key: 'bar'});
    const err = await api
      .startSauceConnect({
        tunnelName: 'my-tunnel',
        'proxy-tunnel': 'abc',
        logger: (log) => logs.push(log),
      })
      .catch((err) => err);
    expect(err.message).toContain('Endpoint not available!');
  });

  it('should start sauce connect with the default version if no version is specified in the args', async () => {
    const logs = [];
    apiPool
      .intercept({
        path: (p) =>
          p.startsWith('/rest/v1/public/tunnels/sauce-connect/download'),
        method: 'GET',
      })
      .reply(200, downloadMacos);
    const api = createApi({user: 'foo', key: 'bar'});
    await api.startSauceConnect({
      tunnelName: 'my-tunnel',
      'proxy-tunnel': 'abc',
      logger: (log) => logs.push(log),
    });
  });

  it('should close sauce connect', async () => {
    apiPool
      .intercept({
        path: (p) =>
          p.startsWith('/rest/v1/public/tunnels/sauce-connect/download'),
        method: 'GET',
      })
      .reply(200, downloadMacos);
    const api = createApi({user: 'foo', key: 'bar'});
    const sc = await api.startSauceConnect({tunnelName: 'my-tunnel'}, true);
    await sc.close();
    expect(process.kill).toBeCalledWith(123, 'SIGINT');
  });

  it('should fail if stderr is emitted', async () => {
    apiPool
      .intercept({
        path: (p) =>
          p.startsWith('/rest/v1/public/tunnels/sauce-connect/download'),
        method: 'GET',
      })
      .reply(200, downloadMacos);
    const api = createApi({user: 'foo', key: 'bar'});
    setTimeout(() => stderrEmitter.emit('data', 'Uuups'), 50);
    const res = await api
      .startSauceConnect({tunnelName: 'my-tunnel'})
      .catch((err) => err);
    expect(res).toEqual(new Error('Uuups'));
  });

  it('should fail on Sauce Connect v4', async () => {
    const api = new SauceLabs({user: 'foo', key: 'bar'});
    const scVersion = '4.9.2';
    const res = await api
      .startSauceConnect({
        tunnelName: 'my-tunnel',
        scVersion: scVersion,
      })
      .catch((err) => err);
    expect(res).toEqual(
      new Error(
        `This Sauce Connect version (${scVersion}) is no longer supported. Please use Sauce Connect 5.`
      )
    );
  });
});

it('should fail with an invalid region', async () => {
  const api = new SauceLabs({user: 'foo', key: 'bar', region: ''});
  const res = await api
    .startSauceConnect({
      tunnelName: 'my-tunnel',
    })
    .catch((err) => err);
  expect(res).toEqual(new Error(`Missing region`));
});

it('should fail when tunnelName is not given', async () => {
  const api = new SauceLabs({user: 'foo', key: 'bar'});
  const res = await api.startSauceConnect({}).catch((err) => err);
  expect(res).toEqual(new Error(`Missing tunnel-name`));
});

test('should output failure msg for createJob API', async () => {
  apiPool
    .intercept({path: '/v1/testcomposer/reports', method: 'POST'})
    .reply(422, 'empty framework');

  const api = createApi({user: 'foo', key: 'bar'});
  const error = await api.createJob({framework: ''}).catch((err) => err);

  expect(error.message).toBe(
    'Failed calling createJob: Response code 422 (Unprocessable Entity), "empty framework"'
  );
});

test('should get user by username', async () => {
  apiPool
    .intercept({
      path: '/team-management/v1/users',
      method: 'GET',
      query: {username: 'fooUser'},
    })
    .reply(200, {results: [{id: 'foo-id'}]});
  const api = createApi({user: 'foo', key: 'bar'});
  const result = await api.getUserByUsername({username: 'fooUser'});
  expect(result).toEqual({id: 'foo-id'});
});

test('should get user by username fail when api fails', async () => {
  apiPool
    .intercept({
      path: '/team-management/v1/users',
      method: 'GET',
      query: {username: 'fooUser'},
    })
    .replyWithError(new Error('example'));
  const api = createApi({user: 'foo', key: 'bar'});
  const error = await api
    .getUserByUsername({username: 'fooUser'})
    .catch((err) => err);
  expect(error).toEqual(
    new Error(
      'There was an error while fetching user information: Failed calling getUsersV1: example, undefined'
    )
  );
});

test('should get list of builds', async () => {
  apiPool
    .intercept({
      path: '/team-management/v1/users',
      method: 'GET',
      query: {username: 'fooUser'},
    })
    .reply(200, {results: [{id: 'foo-id'}]});
  apiPool
    .intercept({
      path: '/v2/builds/vdc/',
      method: 'GET',
      query: {user_id: 'foo-id', offset: 5, limit: 10},
    })
    .reply(200, {builds: [{id: 'build-id'}]});
  const api = createApi({user: 'foo', key: 'bar'});
  const builds = await api.listBuilds('fooUser', {offset: 5, limit: 10});
  expect(builds).toEqual([{id: 'build-id'}]);
});

test('should get builds failed jobs', async () => {
  apiPool
    .intercept({
      path: '/team-management/v1/users',
      method: 'GET',
      query: {username: 'fooUser'},
    })
    .reply(200, {results: [{id: 'foo-id'}]});
  apiPool
    .intercept({
      path: '/v2/builds/vdc/build-1/jobs/',
      method: 'GET',
      query: {user_id: 'foo-id', faulty: true, offset: 5, limit: 10},
    })
    .reply(200, {jobs: [{id: 'job-1'}, {id: 'job-2'}]});
  apiPool
    .intercept({
      path: '/rest/v1.1/jobs?full=true&id=job-1&id=job-2',
      method: 'GET',
    })
    .reply(200, {
      jobs: [
        {id: 'job-1', name: 'foo-job', status: 'failed'},
        {id: 'job-2', name: 'bar-job', status: 'errored'},
      ],
    });
  const api = createApi({user: 'foo', key: 'bar'});
  const failedJobs = await api.listBuildFailedJobs('fooUser', 'build-1', {
    offset: 5,
    limit: 10,
  });
  expect(failedJobs).toMatchSnapshot();
});

test('should get builds jobs', async () => {
  apiPool
    .intercept({
      path: '/v2/builds/vdc/build-1/jobs/',
      method: 'GET',
      query: {offset: 5, limit: 10},
    })
    .reply(200, {jobs: [{id: 'job-1'}, {id: 'job-2'}]});
  apiPool
    .intercept({
      path: '/rest/v1.1/jobs?full=true&id=job-1&id=job-2',
      method: 'GET',
    })
    .reply(200, {
      jobs: [
        {id: 'job-1', name: 'foo-job', status: 'failed'},
        {id: 'job-2', name: 'bar-job', status: 'errored'},
      ],
    });
  const api = createApi({user: 'foo', key: 'bar'});
  const failedJobs = await api.listBuildJobs('build-1', {
    offset: 5,
    limit: 10,
  });
  expect(failedJobs).toMatchSnapshot();
});

test('should stringify searchParams', async () => {
  apiPool
    .intercept({path: '/rest/v1.1/jobs?id=job-1&id=job-2', method: 'GET'})
    .reply(200, {
      jobs: [
        {id: 'job-1', name: 'foo-job', status: 'failed'},
        {id: 'job-2', name: 'bar-job', status: 'errored'},
      ],
    });
  const api = createApi({user: 'foo', key: 'bar'});
  await expect(
    api.getJobsV1_1({id: ['job-1', 'job-2']})
  ).resolves.toBeDefined();
});

test('should get HTTPValidationError when posting test-runs failed', async () => {
  apiPool.intercept({path: '/test-runs/v1/', method: 'POST'}).reply(200, {
    detail: [
      {
        loc: ['body', 14],
        msg: 'Expecting property name enclosed in double quotes: line 1 column 15 (char 14)',
        type: 'value_error.jsondecode',
        ctx: {
          msg: 'Expecting property name enclosed in double quotes',
          doc: '...',
          pos: 14,
          lineno: 1,
          colno: 15,
        },
      },
    ],
  });
  const api = createApi({user: 'foo', key: 'bar'});
  const failedResp = await api.createTestRunsV1({testRuns: []});
  expect(failedResp.detail.length).toEqual(1);
  const detail = failedResp.detail[0];
  expect(detail.type).toEqual('value_error.jsondecode');
  expect(detail.msg).toEqual(
    'Expecting property name enclosed in double quotes: line 1 column 15 (char 14)'
  );
});
