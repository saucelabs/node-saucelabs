import * as utils from '../src/utils';
import SauceConnectLoader from '../src/sauceConnectLoader';
import fs from 'fs';
import https from 'https';
import compressing from 'compressing';

describe('SauceConnectLoader', () => {
  describe('constructor', () => {
    test('should throw if platform is unsupported', () => {
      jest.spyOn(utils, 'getPlatform').mockImplementation(() => 'whatever');
      expect(
        () => new SauceConnectLoader({sauceConnectVersion: '1.2.3'})
      ).toThrow(ReferenceError, 'Unsupported platform whatever');
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
          scl = new SauceConnectLoader({
            sauceConnectVersion: '1.2.3',
          });
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
          scl = new SauceConnectLoader({
            sauceConnectVersion: '1.2.3',
          });
        });

        test('should attempt to download', async () => {
          await scl.verifyAlreadyDownloaded();
          expect(scl._download).toHaveBeenCalled();
        });
      });

      describe('when something else is wrong', () => {
        beforeEach(() => {
          jest
            .spyOn(fs.promises, 'stat')
            .mockImplementation(() => Promise.reject(new Error()));
          scl = new SauceConnectLoader({
            sauceConnectVersion: '1.2.3',
          });
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
        scl = new SauceConnectLoader({sauceConnectVersion: '1.2.3'});
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
        await scl._download();
        expect(mockHttpsGet).toHaveBeenCalledWith(
          scl.url,
          expect.any(Function)
        );
        expect(mockCompressingLinux).toHaveBeenCalled();
      });

      test('should download and uncompress - mac', async () => {
        jest.spyOn(utils, 'getPlatform').mockImplementation(() => 'darwin');
        await scl._download();
        expect(mockHttpsGet).toHaveBeenCalledWith(
          scl.url,
          expect.any(Function)
        );
        expect(mockCompressingWinMac).toHaveBeenCalled();
      });

      test('should download and uncompress - win', async () => {
        jest.spyOn(utils, 'getPlatform').mockImplementation(() => 'win32');
        await scl._download();
        expect(mockHttpsGet).toHaveBeenCalledWith(
          scl.url,
          expect.any(Function)
        );
        expect(mockCompressingWinMac).toHaveBeenCalled();
      });
    });
  });
});
