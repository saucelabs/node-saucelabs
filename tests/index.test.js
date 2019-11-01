import util from 'util'
import got from 'got'

import SauceLabs from '../src'

jest.mock('fs')
const fs = require('fs')

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
    expect(got.mock.calls[0][0])
        .toBe('https://saucelabs.com/rest/v1.1/users/someuser/concurrency')
})

test('should allow to call an API method with param as option', async () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    await api.listJobs('someuser', {
        limit: 123,
        full: true
    })

    const uri = got.mock.calls[0][0]
    const req = got.mock.calls[0][1]
    expect(uri).toBe('https://saucelabs.com/rest/v1.1/someuser/jobs')
    expect(req.searchParams).toEqual({
        limit: 123,
        full: true
    })
})

test('should allow to make a request with body param', async () =>  {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    await api.updateJob('foobaruser', '690c5877710c422d8be4c622b40c747f', { passed: true })

    const req = got.mock.calls[0][1]
    expect(got.put).toBeCalled()
    expect(req.body).toEqual({ passed: true })
})

test('should allow to make a request with body param via CLI call', async () =>  {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    await api.updateJob('foobaruser', '690c5877710c422d8be4c622b40c747f', '{ "passed": false }')

    const req = got.mock.calls[0][1]
    expect(got.put).toBeCalled()
    expect(req.body).toEqual({ passed: false })
})

test('should update RDC job status with body param', async () =>  {
    const api = new SauceLabs({})
    await api.updateTest('89ec3cca-7092-41f1-8037-d035579fb8d1', { passed: true })

    const req = got.mock.calls[0][1]
    expect(got.put).toBeCalled()
    expect(req.body).toEqual({ passed: true })
})

test('should update RDC job status with body param via CLI call', async () =>  {
    const api = new SauceLabs({})
    await api.updateTest('89ec3cca-7092-41f1-8037-d035579fb8d1', '{ "passed": false }')

    const req = got.mock.calls[0][1]
    expect(got.put).toBeCalled()
    expect(req.body).toEqual({ passed: false })
})

test('should fail if param has wrong type', async () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    const error = await api.listJobs(123, {
        limit: 123,
        full: true
    }).catch((err) => err)
    expect(error.message).toBe('Expected parameter for url param \'username\' from type \'string\', found \'number\'')
})

test('should fail if option has wrong type', async () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    const error = await api.listJobs('someuser', {
        limit: '123',
        full: true
    }).catch((err) => err)
    expect(error.message).toBe('Expected parameter for option \'limit\' from type \'number\', found \'string\'')
})

test('should handle error case', async () => {
    const response = new Error('Not Found')
    response.statusCode = 404
    response.body = { message: 'Not Found' }
    got.get.mockReturnValueOnce(Promise.reject(response))
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    const error = await api.listJobs('someuser', {
        limit: 123,
        full: true
    }).catch((err) => err)
    expect(error.message).toBe('Failed calling listJobs, status code: 404, reason: Not Found')
})

test('should be able to download assets', async () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    await api.downloadJobAsset('some-id', 'performance.json')
    const req = got.mock.calls[0][1]
    const uri = got.mock.calls[0][0]
    expect(req.method).toBe('GET')
    expect(uri).toContain('https://assets.saucelabs.com/jobs/some-id/performance.json')
    expect(uri).toContain('auth=a2600100e3d1990721be97c093f64567')
})

test('should handle errors when downloading assets', async () => {
    const response = new Error('Not Found')
    response.statusCode = 404
    response.body = { message: 'Not Found' }
    got.get.mockReturnValueOnce(Promise.reject(response))

    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    const error = await api.downloadJobAsset('some-id', 'performance.json').catch((err) => err)
    expect(error.message).toBe('There was an error downloading asset performance.json, status code: 404, reason: Not Found')
})

it('should parse text responses if headers expect json', async () => {
    const reqRespond = { foo: 'bar' }
    got.get.mockReturnValueOnce(Promise.resolve({
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(reqRespond)
    }))
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    const result = await api.downloadJobAsset('some-id', 'performance.json')
    expect(result).toEqual(reqRespond)
})

it('should fail if parameters are not given properly', async () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    const error = new Error('You need to define a job id and the file name of the asset as a string')
    await expect(api.downloadJobAsset()).rejects.toEqual(error)
    await expect(api.downloadJobAsset('foo')).rejects.toEqual(error)
    await expect(api.downloadJobAsset(123, 'bar')).rejects.toEqual(error)
})

test('should support proxy options', async () => {
    const proxy = 'https://my.proxy.com'
    const api = new SauceLabs({ user: 'foo', key: 'bar', proxy })
    await api.downloadJobAsset('some-id', 'performance.json')
    const requestOptions = got.mock.calls[0][1]

    await expect(requestOptions.proxy).toBeDefined()
    await expect(requestOptions.proxy).toEqual(proxy)
})

test('should put asset into file', async () => {
    const api = new SauceLabs({ user: 'foo', key: 'bar' })
    await api.downloadJobAsset('some-id', 'performance.json', '/asset.json')
    expect(fs.writeFileSync).toBeCalledWith('/asset.json', undefined)
})

afterEach(() => {
    got.mockClear()
})
