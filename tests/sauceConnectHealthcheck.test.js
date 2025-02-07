import SauceConnectHealthCheck from '../src/sauceConnectHealthcheck';
import http from 'http';

describe('SauceConnectHealthcheck', () => {
  let mockHttpGet;
  beforeEach(() => {
    mockHttpGet = jest.spyOn(http, 'get');
  });

  describe('perform', () => {
    test('raises error if response code != 200', async () => {
      mockHttpGet.mockImplementation((url, options, callback) => {
        callback({statusCode: 503});
        return {on: jest.fn()};
      });
      const healthcheck = new SauceConnectHealthCheck();
      const error = await healthcheck
        .perform('http://localhost:8042')
        .catch((err) => err);
      expect(error.message).toBe('response status code 503 != 200');
    });

    test('all good when response code == 200', async () => {
      mockHttpGet.mockImplementation((url, options, callback) => {
        callback({statusCode: 200});
        return {on: jest.fn()};
      });
      const healthcheck = new SauceConnectHealthCheck();
      const result = await healthcheck.perform('http://localhost:8042');
      expect(result).toBe(undefined);
    });
  });
});
