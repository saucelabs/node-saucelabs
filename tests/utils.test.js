import http from 'http'
import https from 'https'
import sauceAPI from '../apis/sauce.json'
import rdcAPI from '../apis/rdc.json'
import {
    createHMAC, getAPIHost, toString, isValidType, getStrictSsl, getAssetHost, createProxyAgent
} from '../src/utils'

test('createHMAC', async () => {
    expect(await createHMAC('foo', 'bar', 'loo123'))
        .toBe('b975a69fa344ed43e1035b0698788705')
})

test('getAPIHost', () => {
    expect(getAPIHost(sauceAPI.servers, sauceAPI.basePath, {}))
        .toBe('https://api.us-west-1.saucelabs.com/rest')
    expect(getAPIHost(sauceAPI.servers, sauceAPI.basePath, { region: 'eu' }))
        .toBe('https://api.eu-central-1.saucelabs.com/rest')
    expect(getAPIHost(sauceAPI.servers, sauceAPI.basePath, { region: 'eu-central-1' }))
        .toBe('https://api.eu-central-1.saucelabs.com/rest')
    expect(getAPIHost(sauceAPI.servers, sauceAPI.basePath, { region: 'us' }))
        .toBe('https://api.us-west-1.saucelabs.com/rest')
    expect(getAPIHost(sauceAPI.servers, sauceAPI.basePath, { region: 'us-west-1' }))
        .toBe('https://api.us-west-1.saucelabs.com/rest')
    expect(getAPIHost(sauceAPI.servers, sauceAPI.basePath, { region: 'us-east-1' }))
        .toBe('https://api.us-east-1.saucelabs.com/rest')
    expect(getAPIHost(sauceAPI.servers, sauceAPI.basePath, { region: 'apac' }))
        .toBe('https://api.apac-southeast-1.saucelabs.com/rest')
    expect(getAPIHost(sauceAPI.servers, sauceAPI.basePath, { region: 'us-west-1', headless: true }))
        .toBe('https://api.us-east-1.saucelabs.com/rest')
    expect(() => getAPIHost(sauceAPI.servers, sauceAPI.basePath, { region: 'foobar' }))
        .toThrow()

    expect(getAPIHost(sauceAPI.servers, sauceAPI.basePath, { tld: 'net' }))
        .toBe('https://api.us-west-1.saucelabs.net/rest')
    expect(getAPIHost(sauceAPI.servers, sauceAPI.basePath, { tld: 'net', region: 'staging' }))
        .toBe('https://api.staging.saucelabs.net/rest')
    expect(() => getAPIHost(sauceAPI.servers, sauceAPI.basePath, { tld: 'info' }))
        .toThrow()

    expect(getAPIHost(rdcAPI.servers, rdcAPI.basePath, {}))
        .toBe('https://app.testobject.com/api/rest')
    expect(getAPIHost(rdcAPI.servers, rdcAPI.basePath, { region: 'us-west-1', headless: true }))
        .toBe('https://app.testobject.com/api/rest')
})

test('getAssetHost', () => {
    expect(getAssetHost({}))
        .toBe('https://assets.saucelabs.com')
    expect(getAssetHost({ region: 'us' }))
        .toBe('https://assets.saucelabs.com')
    expect(getAssetHost({ region: 'us-west-1' }))
        .toBe('https://assets.saucelabs.com')
    expect(getAssetHost({ region: 'eu' }))
        .toBe('https://assets.eu-central-1.saucelabs.com')
    expect(getAssetHost({ region: 'eu-central-1' }))
        .toBe('https://assets.eu-central-1.saucelabs.com')
    expect(getAssetHost({ headless: true }))
        .toBe('https://assets.us-east-1.saucelabs.com')
    expect(getAssetHost({ headless: true, region: 'eu' }))
        .toBe('https://assets.us-east-1.saucelabs.com')
    expect(getAssetHost({ region: 'staging' }))
        .toBe('https://assets.staging.saucelabs.net')
    expect(getAssetHost({ region: 'staging', tld: 'com' }))
        .toBe('https://assets.staging.saucelabs.com')
})

test('toString', () => {
    expect(toString({
        username: 'foobar',
        _accessKey: '50fc1a11-3231-4240-9707-8f34682b17b0',
        _options: { region: 'us', headless: false }
    })).toBe(`SauceLabs API Client {
  username: 'foobar',
  key: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXX2b17b0',
  region: 'us',
  headless: false,
  proxy: undefined
}`)
})

test('isValidType', () => {
    expect(isValidType(0, 'number')).toBe(true)
    expect(isValidType(1, 'number')).toBe(true)
    expect(isValidType('1', 'number')).toBe(false)
    expect(isValidType(['foo', 123], 'array')).toBe(true)
    expect(isValidType(null, 'array')).toBe(false)
})

describe('createProxyAgent', ()=> {
    expect(createProxyAgent('http://my.proxy.com:8080'))
        .toEqual({
            https: {
                _events: expect.anything(),
                _eventsCount: 1,
                createSocket: expect.anything(),
                defaultPort: 443,
                maxSockets: Infinity,
                options:
                {proxy: {host: 'my.proxy.com', 'port': '8080'}},
                requests: [],
                sockets: [],
                proxyOptions: {
                    host: 'my.proxy.com',
                    port: '8080'
                },
                request: http.request
            }
        })
    expect(createProxyAgent('https://my.proxy.com:443'))
        .toEqual({
            https: {
                _events: expect.anything(),
                _eventsCount: 1,
                createSocket: expect.anything(),
                defaultPort: 443,
                maxSockets: Infinity,
                options:
                {proxy: {host: 'my.proxy.com', 'port': '443'}},
                requests: [],
                sockets: [],
                proxyOptions: {
                    host: 'my.proxy.com',
                    port: '443'
                },
                request: https.request
            }
        })
    expect(() => {
        createProxyAgent('ftp://my.proxy.com:21')
    }).toThrowError(/Only http and https protocols are supported for proxying traffic./)

})

describe('getStrictSsl', () => {
    beforeEach(function() {
        delete process.env.STRICT_SSL
        delete process.env.strict_ssl
    })

    it('should return "false" when environment variable "STRICT_SSL" is defined with value "false"', () => {
        process.env['STRICT_SSL'] = 'false'
        expect(getStrictSsl()).toEqual(false)
    })

    it('should return "false" when environment variable "strict_ssl" is defined with value "false"', () => {
        process.env['strict_ssl'] = 'false'
        expect(getStrictSsl()).toEqual(false)
    })

    it('should return "true" when environment variable "STRICT_SSL" is defined with value "true"', () => {
        process.env['STRICT_SSL'] = 'true'
        expect(getStrictSsl()).toEqual(true)
    })

    it('should return "true" when environment variable "strict_ssl" is defined with value "true"', () => {
        process.env['strict_ssl'] = 'true'
        expect(getStrictSsl()).toEqual(true)
    })

    it('should return "true" when environment variable "STRICT_SSL" / "strict_ssl" is not defined', () => {
        expect(getStrictSsl()).toEqual(true)
    })

    it('should return "true" when environment variable "STRICT_SSL" is defined with any other value than "false"', () => {
        process.env['STRICT_SSL'] = 'foo'
        expect(getStrictSsl()).toEqual(true)
    })

    it('should return "true" when environment variable "strict_ssl" is defined with any other value than "false"', () => {
        process.env['strict_ssl'] = 'foo'
        expect(getStrictSsl()).toEqual(true)
    })
})
