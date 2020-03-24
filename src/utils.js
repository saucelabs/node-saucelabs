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
    let locale = headless ? 'us-east-1.' : REGION_MAPPING[dcRegion]
    let subdomain = ''

    /**
     * check if endpoint base has subdomain
     * e.g. api.saucelabs.com
     */
    if (!headless && hostname.split('.').length > 2) {
        subdomain = hostname.split('.')[0] + '.'
        hostname = hostname.split('.').slice(-2).join('.')
        // RDC only has 1 endpoint for both DC's, so if the url contains `testobject` clear the `locale`
        locale = hostname.includes('testobject') ? '' : locale
    } else if (!headless && region === 'us') {
        locale = ''
    } else if (locale === 'us-west-1.') { // us-west-1 is currently not a valid endpoint for Sauce
        locale = ''
    }

    return protocol + subdomain + locale + hostname
}

/**
 * toString method for proxy instance
 * @param  {object} scope  actual API instance
 * @return {string}        to string output
 */
export function toString (scope) {
    return `${TO_STRING_TAG} {
  username: '${scope.username}',
  key: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXX${scope._accessKey.slice(-6)}',
  region: '${scope._options.region}',
  headless: ${scope._options.headless}
}`
}

/**
 * get sorted list of parameters with full description
 * @param  {Array}    [parameters=[]]  parameter defined in endpoint
 * @return {[Object]}                  full description of parameters
 */
export function getParameters (parameters = []) {
    const params = parameters.map(
        (urlParameter) => urlParameter.$ref
            ? PARAMETERS_MAP.get(urlParameter.$ref.split('/').slice(-1)[0])
            : urlParameter)

    return params.sort((a, b) => {
        if (a.required && b.required) {
            return 0
        }
        if (a.required && !b.required) {
            return -1
        }
        return 1
    })
}

/**
 * type check for endpoint parameters
 * @param  {*}      option        given command parameters
 * @param  {String} expectedType  expected parameter type
 * @return {Boolean}              true if typecheck was ok
 */
export function isValidType (option, expectedType) {
    if (expectedType === 'array') {
        return Array.isArray(option)
    }
    return typeof option === expectedType
}

/**
 * If the environment variable "STRICT_SSL" is defined as "false", it doesn't require SSL certificates to be valid.
 * This is used in requests to define the value of the "strictSSL" option.
 */
export function getStrictSsl() {
    return !(process.env.STRICT_SSL === 'false' || process.env.strict_ssl === 'false')
}
