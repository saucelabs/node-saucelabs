import crypto from 'crypto'

import { REGION_MAPPING, TO_STRING_TAG, PARAMETERS_MAP } from './constants'

/**
 * Create HMAC token to receive job assets
 *
 * @param  {string} username  username of user
 * @param  {string} key       access key of user
 * @param  {string} jobId     job id of job you want to get access to
 * @return {string}           hmac token
 */
export function createHMAC (username, key, jobId) {
    const hmac = crypto.createHmac('md5', `${username}:${key}`)
    hmac.write(jobId)
    hmac.end()
    return new Promise((resolve, reject) => hmac.on('readable', () => {
        const data = hmac.read()
        if (!data) {
            return reject(new Error('Could not create HMAC token'))
        }
        return resolve(data.toString('hex'))
    }))
}

/**
 * get sauce API url
 * @param  {string}  hostname  host name of the API that is being used
 * @param  {string}  region    region of the datacenter
 * @param  {boolean} headless  true if job is running on headless instance
 * @param  {string}  protocol  protcol to be used
 * @return {string}            endpoint base url (e.g. `https://us-east1.headless.saucelabs.com`)
 */
export function getSauceEndpoint (hostname, region, headless, protocol = 'https://') {
    const dcRegion = REGION_MAPPING[region] ? region : 'us'
    const prefix = headless ? 'us-east1.headless.' : REGION_MAPPING[dcRegion]
    return protocol + prefix + hostname
}

/**
 * toString method for proxy instance
 * @param  {object} scope  actual API instance
 * @return {string}        to string output
 */
export function toString (scope) {
    return `${TO_STRING_TAG} {
  user: '${scope.username}',
  key: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXX${scope._accessKey.slice(-6)}',
  region: '${scope._options.region}',
  headless: ${scope._options.headless}
}`
}

/**
 * get list of parameters with full description
 * @param  {Array}    [parameters=[]]  parameter defined in endpoint
 * @return {[Object]}                  full description of parameters
 */
export function getParameters (parameters = []) {
    return parameters.map(
        (urlParameter) => urlParameter.$ref
            ? PARAMETERS_MAP.get(urlParameter.$ref.split('/').slice(-1)[0])
            : urlParameter)
}
