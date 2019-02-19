import request from 'request'
import changeCase from 'change-case'

import { PROTOCOL_MAP, PARAMETERS_MAP } from './constants'

export default class SauceLabs {
    constructor (username, accessKey) {
        this.username = username
        this.accessKey = accessKey
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

        return (...args) => {
            const { description, method, endpoint, host } = PROTOCOL_MAP.get(propName)
            const params = description.parameters.map(
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

                url = endpoint.replace(`{${urlParam.name}}`, param)
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
            return new Promise((resolve, reject) => request({
                uri: `https://${host}${url}`,
                method: method.toUpperCase(),
                [method === 'post' ? 'json' : 'qs']: body,
                json: true,
                auth: {
                    user: this.username,
                    pass: this.accessKey
                }
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
}
