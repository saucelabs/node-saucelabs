import { createHMAC, getSauceEndpoint, toString } from '../src/utils'

test('createHMAC', async () => {
    expect(await createHMAC('foo', 'bar', 'loo123'))
        .toBe('b975a69fa344ed43e1035b0698788705')
})

test('getSauceEndpoint', () => {
    expect(getSauceEndpoint('saucelabs.com', 'us', false))
        .toBe('https://saucelabs.com')
    expect(getSauceEndpoint('saucelabs.com', 'us', false, 'http://'))
        .toBe('http://saucelabs.com')
    expect(getSauceEndpoint('saucelabs.com', 'eu', false))
        .toBe('https://eu-central-1.saucelabs.com')
    expect(getSauceEndpoint('saucelabs.com', 'us', true))
        .toBe('https://us-east1.headless.saucelabs.com')
})

test('toString', () => {
    expect(toString({
        username: 'foobar',
        _accessKey: '50fc1a11-3231-4240-9707-8f34682b17b0',
        _options: { region: 'us', headless: false }
    })).toBe(`SauceLabs API Client {
  user: 'foobar',
  key: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXX2b17b0',
  region: 'us',
  headless: false
}`)
})
