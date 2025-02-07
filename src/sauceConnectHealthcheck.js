import http from 'http';
import {SC_HEALTHCHECK_TIMEOUT} from './constants';

export default class SauceConnectHealthCheck {
  async perform(apiAddress) {
    return new Promise((resolve, reject) => {
      const request = http.get(
        `${apiAddress}/readyz`,
        {timeout: SC_HEALTHCHECK_TIMEOUT},
        (response) => {
          if (response.statusCode !== 200) {
            reject(
              new Error(`response status code ${response.statusCode} != 200`)
            );
          } else {
            resolve();
          }
        }
      );

      request.on('error', reject);
      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Request timed out'));
      });
    });
  }
}
