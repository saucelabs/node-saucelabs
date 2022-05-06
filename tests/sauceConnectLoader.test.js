import * as utils from '../src/utils';
import SauceConnectLoader from '../src/sauceConnectLoader';
import {promises} from 'fs';
import download from 'download';

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
            .spyOn(promises, 'stat')
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
            .spyOn(promises, 'stat')
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
            .spyOn(promises, 'stat')
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

    describe('_download()', () => {
      let scl;

      beforeEach(() => {
        jest
          .spyOn(promises, 'chmod')
          .mockImplementation(() => Promise.resolve());
        scl = new SauceConnectLoader({sauceConnectVersion: '1.2.3'});
      });

      test('should delegate to `download` pkg', async () => {
        await scl._download();
        expect(download).toHaveBeenCalledWith(scl.url, scl.dest, {
          extract: true,
          strip: 1,
        });
      });
    });
  });
});
