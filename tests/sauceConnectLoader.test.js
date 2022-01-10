import * as utils from '../src/utils'
import SauceConnectLoader from '../src/sauceConnectLoader'
import { promises } from 'fs'
import download from 'download'
describe('constructor', () => {
    test('should throw if platform is unsupported', () => {
        jest.spyOn(utils, 'getPlatform').mockImplementation(() => 'whatever')
        expect(
            () => new SauceConnectLoader({ sauceConnectVersion: '1.2.3' })
        ).toThrow(ReferenceError, 'Unsupported platform whatever')
    })

    afterEach(() => {
        utils.getPlatform.mockRestore()
    })
})

describe('verifyAlreadyDownloaded()', () => {
    beforeEach(() => {
        jest.spyOn(
            SauceConnectLoader.prototype,
            '_download'
        ).mockImplementation(() => Promise.resolve())
    })

    afterEach(() => {
        SauceConnectLoader.prototype._download.mockRestore()
    })

    describe('when executable exists', () => {
        beforeEach(() => {
            jest.spyOn(promises, 'stat').mockImplementation(() =>
                Promise.resolve()
            )
        })

        afterEach(() => {
            promises.stat.mockRestore()
        })
        test('should not attempt to download anything', async () => {
            const scl = new SauceConnectLoader({ sauceConnectVersion: '1.2.3' })
            await scl.verifyAlreadyDownloaded()
            expect(scl._download).not.toHaveBeenCalled()
        })
    })

    describe('when executable does not exist', () => {
        beforeEach(() => {
            jest.spyOn(promises, 'stat').mockImplementation(() =>
                Promise.reject({ code: 'ENOENT' })
            )
        })

        afterEach(() => {
            promises.stat.mockRestore()
        })
        
        test('should attempt to download', async () => {
            const scl = new SauceConnectLoader({ sauceConnectVersion: '1.2.3' })
            await scl.verifyAlreadyDownloaded()
            expect(scl._download).toHaveBeenCalled()
        })
    })

    describe('when something else is wrong', () => {
        beforeEach(() => {
            jest.spyOn(promises, 'stat').mockImplementation(() =>
                Promise.reject(new Error())
            )
        })
        
        test('should reject', () => {
            const scl = new SauceConnectLoader({ sauceConnectVersion: '1.2.3' })
            return expect(scl.verifyAlreadyDownloaded()).rejects.toThrow()
        })
        
    })
})

describe('_download()', () => {
    beforeEach(() => {
        jest.spyOn(promises, 'chmod').mockImplementation(() =>
            Promise.resolve()
        )
    })

    afterEach(() => {
        promises.chmod.mockRestore()
    })

    test('should delegate to `download` pkg', async () => {
        const scl = new SauceConnectLoader({ sauceConnectVersion: '1.2.3' })
        await scl._download()
        expect(download).toHaveBeenCalledWith(scl.url, scl.dest, {
            extract: true,
            strip: 1,
        })
    })
})
