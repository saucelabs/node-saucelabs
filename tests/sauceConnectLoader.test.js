import * as utils from '../src/utils'
import SauceConnectLoader from '../src/sauceConnectLoader'

jest.spyOn(utils, 'getPlatform').mockImplementation(() => 'whatever')

test('should throw if platform is unsupported', () => {
    expect(() => new SauceConnectLoader({sauceConnectVersion: '1.2.3'})).toThrow(ReferenceError, 'Unsupported platform whatever')
})
