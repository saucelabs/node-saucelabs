import * as utils from '../src/utils';
import SauceConnectLoader from '../src/sauceConnectLoader';
import fs from 'fs';
import https from 'https';
import compressing from 'compressing';

describe('SauceConnectLoader', () => {
  describe('constructor', () => {
    test('should have .exe path for windows platform', () => {
      // Enable monkey patching process.platform.
      const originalPlatform = process.platform;
      let platform = 'win32';
      Object.defineProperty(process, 'platform', {get: () => platform});

      const scl = new SauceConnectLoader('1.2.3');
      expect(scl.path).toContain('exe');

      // Restore the original value of process.platform.
      platform = originalPlatform;
    });

    test('should not have .exe path for non-windows platform', () => {
      // Enable monkey patching process.platform.
      const originalPlatform = process.platform;
      let platform = 'linux';
      Object.defineProperty(process, 'platform', {get: () => platform});

      const scl = new SauceConnectLoader('1.2.3');
      expect(scl.path).not.toContain('exe');

      // Restore the original value of process.platform.
      platform = originalPlatform;
    });
  });

  describe('method', () => {
    describe('verifyAlreadyDownloaded()', () => {
      let scl;

      beforeEach(() => {
        jest
          .spyOn(SauceConnectLoader.prototype, '_download')
          .mockImplementation(() => Promise.resolve());
      });

      describe('when executable exists', () => {
        beforeEach(() => {
          jest
            .spyOn(fs.promises, 'stat')
            .mockImplementation(() => Promise.resolve());
          scl = new SauceConnectLoader('1.2.3');
        });

        test('should not attempt to download anything', async () => {
          await scl.verifyAlreadyDownloaded();
          expect(scl._download).not.toHaveBeenCalled();
        });
      });

      describe('when executable does not exist', () => {
        beforeEach(() => {
          jest
            .spyOn(fs.promises, 'stat')
            .mockImplementation(() => Promise.reject({code: 'ENOENT'}));
          scl = new SauceConnectLoader('1.2.3');
        });

        test('should attempt to download', async () => {
          let url = 'https://this-is-a-test.com';
          await scl.verifyAlreadyDownloaded({url: url});
          expect(scl._download).toHaveBeenCalledWith(url);
        });

        test('should not attempt to download when url is not provided', async () => {
          await scl.verifyAlreadyDownloaded();
          expect(scl._download).not.toHaveBeenCalled();
        });
      });

      describe('when something else is wrong', () => {
        beforeEach(() => {
          jest
            .spyOn(fs.promises, 'stat')
            .mockImplementation(() => Promise.reject(new Error()));
          scl = new SauceConnectLoader('1.2.3');
        });

        test('should reject', () => {
          return expect(scl.verifyAlreadyDownloaded()).rejects.toThrow();
        });
      });
    });

    // test the _download method with mock https.get and mock compressing
    describe('_download()', () => {
      let scl;
      let mockHttpsGet;
      let mockCompressingLinux;
      let mockCompressingWinMac;

      beforeEach(() => {
        jest
          .spyOn(fs.promises, 'chmod')
          .mockImplementation(() => Promise.resolve());
        jest
          .spyOn(fs.promises, 'rename')
          .mockImplementation(() => Promise.resolve());
        scl = new SauceConnectLoader('1.2.3');
        mockHttpsGet = jest.spyOn(https, 'get');

        mockCompressingLinux = jest
          .spyOn(compressing.tgz, 'uncompress')
          .mockImplementation(() => Promise.resolve());
        mockCompressingWinMac = jest
          .spyOn(compressing.zip, 'uncompress')
          .mockImplementation(() => Promise.resolve());
      });

      test('should download and uncompress - linux', async () => {
        jest.spyOn(utils, 'getPlatform').mockImplementation(() => 'linux');

        // linux downloads have .tar.gz compression
        const url = 'https://httpbin.org/get/some_file.tar.gz';
        await scl._download(url);
        expect(mockHttpsGet).toHaveBeenCalledWith(url, expect.any(Function));
        expect(mockCompressingLinux).toHaveBeenCalled();
      });

      test('should download and uncompress - macos', async () => {
        jest.spyOn(utils, 'isWindows').mockImplementation(() => false);

        // macos downloads have .zip compression
        const url = 'https://httpbin.org/get/some_file.zip';
        await scl._download(url);
        expect(mockHttpsGet).toHaveBeenCalledWith(url, expect.any(Function));
        expect(mockCompressingWinMac).toHaveBeenCalled();
      });

      test('should download and uncompress - windows', async () => {
        jest.spyOn(utils, 'isWindows').mockImplementation(() => true);

        // windows downloads have .zip compression
        const url = 'https://httpbin.org/get/some_file.zip';
        await scl._download(url);
        expect(mockHttpsGet).toHaveBeenCalledWith(url, expect.any(Function));
        expect(mockCompressingWinMac).toHaveBeenCalled();
      });
    });

    describe('_download()', () => {
      test('should handle download error', async () => {
        const scl = new SauceConnectLoader('1.2.3');
        const url = 'https://this-will-not-resolve.penguin';
        ``;
        const err = await scl._download(url).catch((err) => err);
        expect(err.message).toContain('this-will-not-resolve.penguin');
      });
    });
  });
});
