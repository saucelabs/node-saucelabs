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

    describe('short ready timeout', () => {
      let origHealthcheckTimeout = constants.SC_HEALTHCHECK_TIMEOUT;
      let origReadyTimeout = constants.SC_READY_TIMEOUT;
      beforeEach(() => {
        // eslint-disable-next-line no-import-assign
        Object.defineProperty(constants, 'SC_HEALTHCHECK_TIMEOUT', {value: 10});
        // eslint-disable-next-line no-import-assign
        Object.defineProperty(constants, 'SC_READY_TIMEOUT', {value: 100});
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

      afterEach(() => {
        // eslint-disable-next-line no-import-assign
        Object.defineProperty(constants, 'SC_HEALTHCHECK_TIMEOUT', {
          value: origHealthcheckTimeout,
        });
        // eslint-disable-next-line no-import-assign
        Object.defineProperty(constants, 'SC_READY_TIMEOUT', {
          value: origReadyTimeout,
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
