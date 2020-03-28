import { createHMAC, getSauceEndpoint, toString, isValidType, createProxyAgent, getStrictSsl } from '../src/utils'
import http from 'http'
import https from 'https'

test('createHMAC', async () => {
    expect(await createHMAC('foo', 'bar', 'loo123'))
        .toBe('b975a69fa344ed43e1035b0698788705')
})

test('getSauceEndpoint', () => {
    expect(getSauceEndpoint('saucelabs.com', 'us', false))
        .toBe('https://saucelabs.com')
    expect(getSauceEndpoint('saucelabs.com', 'us-west-1', false))
        .toBe('https://saucelabs.com')
    expect(getSauceEndpoint('saucelabs.com', 'I_DONT_EXIST', false))
        .toBe('https://saucelabs.com')
    expect(getSauceEndpoint('saucelabs.com', 'us', false, 'http://'))
        .toBe('http://saucelabs.com')
    expect(getSauceEndpoint('saucelabs.com', 'eu', false))
        .toBe('https://eu-central-1.saucelabs.com')
    expect(getSauceEndpoint('saucelabs.com', 'eu-central-1', false))
        .toBe('https://eu-central-1.saucelabs.com')
    expect(getSauceEndpoint('saucelabs.com', 'us', true))
        .toBe('https://us-east-1.saucelabs.com')
    expect(getSauceEndpoint('api.saucelabs.com', 'us', false))
        .toBe('https://api.us-west-1.saucelabs.com')
    expect(getSauceEndpoint('api.saucelabs.com', 'eu', false))
        .toBe('https://api.eu-central-1.saucelabs.com')
    expect(getSauceEndpoint('app.testobject.com', 'eu', false))
        .toBe('https://app.testobject.com')
    expect(getSauceEndpoint('app.testobject.com', 'us', false))
        .toBe('https://app.testobject.com')
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
        .toEqual(expect.objectContaining({
            proxyOptions: {
                host: 'my.proxy.com',
                port: '8080'
            },
            request: http.request
        }))
    expect(createProxyAgent('https://my.proxy.com:443'))
        .toEqual(expect.objectContaining({
            proxyOptions: {
                host: 'my.proxy.com',
                port: '443'
            },
            request: https.request
        }))
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
