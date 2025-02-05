import {SauceConnectManager} from '../src/sauceConnectManager';
import * as constants from '../src/constants';

describe('SauceConnectManager', () => {
  describe('waitForReady', () => {
    test('process terminated with exitCode', async () => {
      const manager = new SauceConnectManager({
        exitCode: 1,
        stderr: {
          on: jest.fn(),
        },
        stdout: {
          on: jest.fn(),
        },
      });
      const error = await manager.waitForReady(':8042').catch((err) => err);
      expect(error.message).toBe(
        'Sauce Connect exited before reaching a ready state'
      );
    });

    test('error when requesting healthcheck', async () => {
      const manager = new SauceConnectManager(
        {
          stderr: {
            on: jest.fn(),
          },
          stdout: {
            on: jest.fn(),
          },
        },
        undefined,
        {
          async perform() {
            throw new Error('custom error');
          },
        }
      );
      const error = await manager.waitForReady(':8042').catch((err) => err);
      expect(error.message).toBe('custom error');
    });

    describe('waiting too long for healthcheck', () => {
      let origTimeout = constants.SC_READY_TIMEOUT;
      beforeEach(() => {
        // eslint-disable-next-line no-import-assign
        Object.defineProperty(constants, 'SC_READY_TIMEOUT', {value: 10});
      });

      test('waiting too long for healthcheck', async () => {
        const manager = new SauceConnectManager({
          stderr: {
            on: jest.fn(),
          },
          stdout: {
            on: jest.fn(),
          },
        });
        const error = await manager.waitForReady(':8042').catch((err) => err);
        expect(error.message).toBe('Timeout waiting for healthcheck endpoint');
      });

      afterEach(() => {
        // eslint-disable-next-line no-import-assign
        Object.defineProperty(constants, 'SC_READY_TIMEOUT', {
          value: origTimeout,
        });
      });
    });
  });

  describe('close', () => {
    test('process terminated with exitCode', async () => {
      const manager = new SauceConnectManager({
        exitCode: 1,
      });
      const result = await manager.close();
      expect(result).toBe(undefined);
    });

    test('reacts to process exit event', async () => {
      const manager = new SauceConnectManager({
        pid: 123,
        on: (event, callback) => setTimeout(callback, 10),
      });

      await manager.close();
    });
  });
});
