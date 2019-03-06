import crypto from 'crypto'

import { REGION_MAPPING } from './constants'

/**
 * Create HMAC token to receive job assets
 *
 * @param  {string} username  username of user
 * @param  {string} key       access key of user
 * @param  {string} jobId     job id of job you want to get access to
 * @return {string}           hmac token
 */
export const createHMAC = function (username, key, jobId) {
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

export function getSauceEndpoint (hostname, region, headless, protocol = 'https://') {
    const dcRegion = REGION_MAPPING[region] ? region : 'us'
    const prefix = headless ? 'us-east1.headless.' : REGION_MAPPING[dcRegion]
    return protocol + prefix + hostname
}
