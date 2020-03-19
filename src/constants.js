import changeCase from 'change-case'

const protocols = [
    require('../apis/sauce.json'),
    require('../apis/rdc.json'),
    require('../apis/performance.json'),
    require('../apis/testrunner.json')
]

const protocolFlattened = new Map()
const parametersFlattened = new Map()
for (const { paths, parameters, basePath, servers } of protocols) {
    for (const [name, description] of Object.entries(parameters || {})) {
        parametersFlattened.set(name, description)
    }

    for (const [endpoint, methods] of Object.entries(paths)) {
        for (const [method, description] of Object.entries(methods)) {
            let commandName = changeCase.camelCase(description.operationId)

            /**
             * mark commands as depcrecated in the command names
             */
            if (description.deprecated) {
                commandName += 'Deprecated'
            }

            /**
             * ensure we don't double register commands
             */
            if (protocolFlattened.has(commandName)) {
                throw new Error(`command ${commandName} already registered`)
            }

            protocolFlattened.set(
                commandName,
                { method, endpoint, description, servers, basePath }
            )
        }
    }
}

export const PROTOCOL_MAP = protocolFlattened
export const PARAMETERS_MAP = parametersFlattened
export const JOB_ASSET_NAMES = [
    'console.json',
    'performance.json',
    'automator.log',
    'selenium-server.log',
    'log.json',
    'logcat.log',
    'video.mp4'
]

export const DEFAULT_OPTIONS = {
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    headless: false,
    region: 'us'
}

export const ASSET_REGION_MAPPING = {
    'us': '',
    'eu': 'eu-central-1.',
    'us-west-1': '',
    'us-east-1': 'us-east-1.',
    'eu-central-1': 'eu-central-1.',
    'staging': 'staging.'
}

export const SYMBOL_INSPECT = Symbol.for('nodejs.util.inspect.custom')
export const SYMBOL_TOSTRING = Symbol.toStringTag
export const SYMBOL_ITERATOR = Symbol.iterator
export const TO_STRING_TAG = 'SauceLabs API Client'
export const DEFAULT_PROTOCOL = 'https://'

export const USAGE = `Sauce Labs API CLI

Usage: sl <command> [options]`

export const EPILOG = `Copyright ${(new Date()).getUTCFullYear()} © Sauce Labs`

export const CLI_PARAMS = [{
    alias: 'h',
    name: 'help',
    description: 'prints help menu'
}, {
    alias: 'u',
    name: 'user',
    description: 'your Sauce Labs username'
}, {
    alias: 'k',
    name: 'key',
    description: 'your Sauce Labs user key'
}, {
    alias: 'r',
    name: 'region',
    default: DEFAULT_OPTIONS.region,
    description: 'your Sauce Labs datacenter region, the following regions are available: `us-west-1` (short `us`), `eu-central-1` (short `eu`)'
}, {
    alias: 'h',
    name: 'headless',
    default: DEFAULT_OPTIONS.headless,
    description: 'if set to true you are accessing the headless Sauce instances (this discards the `region` option)'
}, {
    alias: 'p',
    name: 'proxy',
    description: 'use a proxy for fetching data instead of environment variables'
}]
