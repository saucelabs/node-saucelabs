const { SAUCE_CONNECT_CLI_PARAMS, ASSET_REGION_MAPPING } = require('../src/constants')
const regions = Object.keys(ASSET_REGION_MAPPING).map(key => `"${key}"`).join(' | ')

exports.TS_IMPORTS = `
import { ChildProcess } from 'child_process';
`

exports.TS_SAUCELABS_OBJ = `
export interface SauceLabsOptions {
    /**
     * Your Sauce Labs username.
     */
    user: string;
    /**
     * Your Sauce Labs access key.
     */
    key: string;
    /**
     * Your Sauce Labs datacenter region. The following regions are available:
     *
     * - us-west-1 (short 'us')
     * - eu-central-1 (short 'eu')
     * - us-east-1 (headless)
     */
    region?: ${regions};
    /**
     * If set to true you are accessing the headless Sauce instances (this discards the region option).
     */
    headless?: boolean;
    /**
     * If you want to tunnel your API request through a proxy please provide your proxy URL.
     */
    proxy?: string;
    /**
     * If you want to set request headers, as example {'User-Agent': 'node-saucelabs'}
     */
    headers?: object;
}`

exports.TC_SAUCE_CONNECT_OBJ = `
export interface SauceConnectOptions {
    /**
     * A function to optionally write sauce-connect-launcher log messages, e.g. console.log
     */
    logger?: (output: string) => void;
${SAUCE_CONNECT_CLI_PARAMS.map((option) => `
    /**
     * ${option.description} ${option.default ? `(default: ${option.default})` : ''}
     */
    ${option.name.replace(/-[a-z]/g, (r) => r.slice(1).toUpperCase())}?: ${option.type || 'string'};
`).join('\n')}
}
`

exports.TC_SAUCE_CONNECT_CLASS = `
export interface SauceConnectInstance {
    /**
     * Sauce Connect child process
     */
    cp: ChildProcess;
    /**
     * shutdown Sauce Connect
     */
    close: () => Promise<undefined>;
}
`

exports.TC_START_SC = `
    /**
     * Start Sauce Connect
     * @method
     * @name SauceLabs#startSauceConnect
     * @param {string} id - job id
     */
    startSauceConnect(params: SauceConnectOptions): Promise<SauceConnectInstance>;
`
