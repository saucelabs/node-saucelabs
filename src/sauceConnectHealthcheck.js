import {SC_HEALTHCHECK_TIMEOUT} from './constants';

export default class SauceConnectHealthCheck {
  async perform(apiAddress) {
    const response = await fetch(`${apiAddress}/readyz`, {
      signal: AbortSignal.timeout(SC_HEALTHCHECK_TIMEOUT),
    });
    if (response.status !== 200) {
      throw new Error(`response status code ${response.status} != 200`);
    }
  }
}
