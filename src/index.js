import fs from 'fs'
import zlib from 'zlib'
import path from 'path'
import request from 'request'
import changeCase from 'change-case'

import { createHMAC, getSauceEndpoint, toString } from './utils'
import {
    PROTOCOL_MAP, PARAMETERS_MAP, DEFAULT_OPTIONS, SYMBOL_INSPECT,
    SYMBOL_TOSTRING, SYMBOL_ITERATOR, TO_STRING_TAG
} from './constants'

export default class SauceLabs {
    constructor (options) {
        this._options = Object.assign({}, DEFAULT_OPTIONS, options)
        this.username = this._options.user
        this._accessKey = this._options.key
        this._auth = {
            user: this.username,
            pass: this._accessKey
        }

        /**
         * public fields
         */
        this.region = this._options.region
        this.headless = this._options.headless

        return new Proxy({}, { get: ::this.get })
    }

    get (obj, propName) {
        /**
         * print to string output
         * https://nodejs.org/api/util.html#util_util_inspect_custom
         */
        if (propName === SYMBOL_INSPECT) {
            return () => toString(this)
        }

        /**
         * print to string tag
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag
         */
        if (propName === SYMBOL_TOSTRING) {
            return TO_STRING_TAG
        }

        /**
         * return instance iterator
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
         */
        if (propName === SYMBOL_ITERATOR) {
            return
        }

        /**
         * allow to return publicly registered class properties
         */
        if (this[propName]) {
            return !propName.startsWith('_') ? this[propName] : undefined
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
                if ((isRequired || option) && (!option || typeof option !== expectedType)) {
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
            const uri = getSauceEndpoint(host, this._options.region, this._options.headless) + url
            return new Promise((resolve, reject) => request({
                uri,
                method: method.toUpperCase(),
                [method === 'post' ? 'json' : 'qs']: body,
                json: true,
                auth: this._auth
            }, (err, response, body) => {
                /* istanbul ignore if */
                if (err) {
                    return reject(err)
                }

                /* istanbul ignore if */
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

        const hmac = await createHMAC(this.username, this._accessKey, jobId)
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
