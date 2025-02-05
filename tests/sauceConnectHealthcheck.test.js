import SauceConnectHealthCheck from '../src/sauceConnectHealthcheck';

const fetchMock = jest.fn();
global.fetch = fetchMock;

describe('SauceConnectHealthcheck', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  describe('perform', () => {
    test('raises error if response code != 200', async () => {
      fetchMock.mockImplementation(async () => ({
        status: 503,
      }));
      const healthcheck = new SauceConnectHealthCheck();
      const error = await healthcheck.perform(':8042').catch((err) => err);
      expect(error.message).toBe('response status code 503 != 200');
    });

    test('all good when response code == 200', async () => {
      fetchMock.mockImplementation(async () => ({
        status: 200,
      }));
      const healthcheck = new SauceConnectHealthCheck();
      const result = await healthcheck.perform(':8042');
      expect(result).toBe(undefined);
    });
  });
});
