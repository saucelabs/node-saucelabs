import fs from 'fs'
import zlib from 'zlib'
import path from 'path'
import request from 'request'
import changeCase from 'change-case'

import { createHMAC, getSauceEndpoint } from './utils'
import { PROTOCOL_MAP, PARAMETERS_MAP, DEFAULT_OPTIONS } from './constants'

export default class SauceLabs {
    constructor (options) {
        this.options = Object.assign({}, DEFAULT_OPTIONS, options)
        this.username = this.options.user
        this.accessKey = this.options.key
        this.headless = this.options.headless
        this.auth = {
            user: this.username,
            pass: this.accessKey
        }

        return new Proxy({}, { get: ::this.get })
    }

    get (obj, propName) {
        /**
         * allow to return publicly registered class properties
         */
        if (this[propName]) {
            return this[propName]
        }

        if (!PROTOCOL_MAP.has(propName)) {
            throw new Error(`Couldn't find API endpoint for command "${propName}"`)
        }

        /**
         * handle special commands not defined in the protocol
         */
        if (propName === 'downloadJobAsset') {
            return ::this.downloadJobAsset
        }

        return (...args) => {
            const { description, method, endpoint, host } = PROTOCOL_MAP.get(propName)
            const params = (description.parameters || []).map(
                (urlParameter) => urlParameter.$ref
                    ? PARAMETERS_MAP.get(urlParameter.$ref.split('/').slice(-1)[0])
                    : urlParameter)

            /**
             * validate required url params
             */
            let url = endpoint
            for (const [i, urlParam] of Object.entries(params.filter(p => p.in === 'path'))) {
                const param = args[i]
                const type = urlParam.type.replace('integer', 'number')

                if (typeof param !== type) {
                    throw new Error(`Expected parameter for url param '${urlParam.name}' from type '${type}', found '${typeof param}'`)
                }

                url = url.replace(`{${urlParam.name}}`, param)
            }

            /**
             * validate required options
             */
            const bodyMap = new Map()
            const options = args.slice(params.filter(p => p.required).length)[0] || {}
            for (const optionParam of params.filter(p => p.in === 'query')) {
                const expectedType = optionParam.type.replace('integer', 'number')
                const option = options[changeCase.camelCase(optionParam.name)]
                const isRequired = Boolean(optionParam.required) || (typeof optionParam.required === 'undefined' && typeof optionParam.default === 'undefined')
                if (isRequired && (!option || typeof option !== expectedType)) {
                    throw new Error(`Expected parameter for option '${optionParam.name}' from type '${expectedType}', found '${typeof option}'`)
                }

                if (option) {
                    bodyMap.set(optionParam.name, option)
                }
            }

            /**
             * convert map into json object
             */
            const body = [...bodyMap.entries()].reduce((e, [k, v]) => {
                e[k] = v
                return e
            }, {})

            /**
             * make request
             */
            const uri = getSauceEndpoint(host, this.options.region, this.headless) + url
            return new Promise((resolve, reject) => request({
                uri,
                method: method.toUpperCase(),
                [method === 'post' ? 'json' : 'qs']: body,
                json: true,
                auth: this.auth
            }, (err, response, body) => {
                if (err) {
                    return reject(err)
                }

                if (response.statusCode !== 200) {
                    return reject(new Error(body.message || 'unknown error'))
                }

                return resolve(body)
            }))
        }
    }

    async downloadJobAsset (jobId, assetName, downloadPath) {
        /**
         * check job id
         */
        if (typeof jobId !== 'string') {
            throw new Error('You need to define a job id')
        }

        const hmac = await createHMAC(this.username, this.accessKey, jobId)
        return new Promise((resolve, reject) => {
            const req = request({
                method: 'GET',
                uri: `https://assets.${this.host}/jobs/${jobId}/${assetName}?ts=${Date.now()}&auth=${hmac}`
            }, (err, res, body) => {
                /**
                 * check if request was successful
                 */
                if (err) {
                    return reject(err)
                }

                /**
                 * check if we received the asset
                 */
                if (res.statusCode !== 200) {
                    return reject(new Error(`There was an error downloading asset ${assetName}, status code: ${res.statusCode}`))
                }

                return resolve(body)
            })

            /**
             * only pipe asset to file if path is given
             */
            if (downloadPath) {
                const fd = fs.createWriteStream(path.resolve(process.cwd(), downloadPath))

                /**
                 * unzip gzipped logs
                 * ToDo: this only affects tracing logs which are uploaded gzipped,
                 *       there should be seperate api definition for extended debugging
                 */
                if (assetName.endsWith('.gz')) {
                    const gunzip = zlib.createGunzip()
                    req.pipe(gunzip).pipe(fd)
                } else {
                    req.pipe(fd)
                }
            }
        })
    }
}
