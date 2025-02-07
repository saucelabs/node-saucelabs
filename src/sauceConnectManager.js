import {
  SC_CLOSE_TIMEOUT,
  SC_HEALTHCHECK_TIMEOUT,
  SC_READY_TIMEOUT,
} from './constants';
import SauceConnectHealthCheck from './sauceConnectHealthcheck';

export class SauceConnectManager {
  constructor(cp, logger, healthcheck) {
    this.cp = cp;
    this.logger = logger || (() => {});
    this.healthcheck = healthcheck || new SauceConnectHealthCheck();
    this._healthcheckInterval = null;
    this._readyTimeout = null;
  }

  waitForReady(apiAddress) {
    let lastHealthcheckErr = null;
    apiAddress = this._parseApiAddress(apiAddress);

    return new Promise((resolve, reject) => {
      this.cp.stderr.on('data', (data) => {
        const output = data.toString();
        return reject(new Error(output));
      });

      this.cp.stdout.on('data', (data) => {
        const logger = this.logger;
        if (typeof logger === 'function') {
          logger(data.toString());
        }
      });

      this._healthcheckInterval = setInterval(async () => {
        if (this.cp.exitCode !== null && this.cp.exitCode !== undefined) {
          clearInterval(this._healthcheckInterval);
          clearTimeout(this._readyTimeout);
          return reject(
            new Error('Sauce Connect exited before reaching a ready state')
          );
        }

        this.healthcheck
          .perform(apiAddress)
          .then(() => {
            clearInterval(this._healthcheckInterval);
            clearTimeout(this._readyTimeout);
            resolve();
          })
          .catch((err) => {
            lastHealthcheckErr = err;
          });
      }, SC_HEALTHCHECK_TIMEOUT);

      this._readyTimeout = setTimeout(() => {
        clearInterval(this._healthcheckInterval);
        console.error(
          `Timeout waiting for healthcheck endpoint, err=${lastHealthcheckErr?.message}, code=${lastHealthcheckErr?.code}`
        );
        reject(
          lastHealthcheckErr ||
            new Error('Timeout waiting for healthcheck endpoint')
        );
      }, SC_READY_TIMEOUT);
    });
  }

  close() {
    this.logger('Terminating Sauce Connect...');

    return new Promise((resolve) => {
      if (this.cp.exitCode !== null && this.cp.exitCode !== undefined) {
        return resolve();
      }

      const timeout = setTimeout(() => {
        this.logger('Forcefully terminating Sauce Connect...');
        killSilently(this.cp.pid, 'SIGKILL');
        resolve();
      }, SC_CLOSE_TIMEOUT);

      this.cp.on('exit', () => {
        clearTimeout(timeout);
        resolve();
      });

      clearInterval(this._healthcheckInterval);
      clearTimeout(this._readyTimeout);
      killSilently(this.cp.pid, 'SIGINT');
    });
  }

  _parseApiAddress(value) {
    const [host, port] = value.split(':');
    return `http://${host || 'localhost'}:${port}`;
  }
}

function killSilently(pid, signal) {
  try {
    process.kill(pid, signal);
  } catch (err) {
    // ignore
  }
}
