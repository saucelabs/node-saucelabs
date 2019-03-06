import util from 'util'
import request from 'request'

import SauceLabs from '../src'

test('should be inspectable', () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    expect(util.inspect(api)).toBe(`SauceLabs API Client {
  user: 'foo',
  key: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXbar',
  region: 'us',
  headless: false
}`)
})

test('should have to string tag', () => {
    expect(Object.prototype.toString.call(
        new SauceLabs({ user: 'foo', key: 'bar' })
    )).toBe('[object SauceLabs API Client]')
})

test('should not provide an iterator', () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    expect(() => [...api]).toThrow('api is not iterable')
})

test('should return public properties', () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    expect(api.region).toBe('us')
    expect(api.username).toBe('foo')
    expect(api._accessKey).toBe(undefined)
})

test('should grab username and access key from env variable', () => {
    jest.resetModules()
    process.env.SAUCE_USERNAME = 'barfoo'
    process.env.SAUCE_ACCESS_KEY = 'foobar'
    const SauceLabsNew = require('../src').default
    const api = new SauceLabsNew()
    expect(util.inspect(api))
        .toContain('user: \'barfoo\'')
    expect(util.inspect(api))
        .toContain('key: \'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXfoobar\'')
})

test('should throw if API command is unknown', () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    expect(() => api.doSomethingCool(123, { foo: 'bar' }))
        .toThrow('Couldn\'t find API endpoint for command "doSomethingCool"')
})

test('should allow to call an API method with param in url', async () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    await api.getUserConcurrency('someuser')
    expect(request.mock.calls[0][0].uri)
        .toBe('https://saucelabs.com/rest/v1.1/users/someuser/concurrency')
})

test('should allow to call an API method with param as option', async () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    await api.listJobs('someuser', {
        limit: 123,
        full: true
    })
    expect(request.mock.calls[0][0].uri)
        .toBe('https://saucelabs.com/rest/v1.1/someuser/jobs')
    expect(request.mock.calls[0][0].qs).toEqual({
        limit: 123,
        full: true
    })
})

test('should fail if param has wrong type', () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    expect(() => api.listJobs(123, {
        limit: 123,
        full: true
    })).toThrow('Expected parameter for url param \'username\' from type \'string\', found \'number\'')
})

test('should fail if option has wrong type', async () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    expect(() => api.listJobs('someuser', {
        limit: '123',
        full: true
    })).toThrow('Expected parameter for option \'limit\' from type \'number\', found \'string\'')
})

afterEach(() => {
    request.mockClear()
})
