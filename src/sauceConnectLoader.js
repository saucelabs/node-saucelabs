/**
 * Note:
 * This is a modified fork of https://github.com/kevva/bin-wrapper
 * The module had a CVE-2021-3795 vulnerability and decided to fork
 * and "simplify" the implementation
 *
 * Original licence:
 *
 * MIT License
 * Copyright (c) Kevin Mårtensson <kevinmartensson@gmail.com>
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
import {format} from 'util';
import {SAUCE_CONNECT_PLATFORM_DATA} from './constants';
import {getPlatform} from './utils';
import {mkdirSync, unlinkSync, createWriteStream} from 'fs';
import {basename, join} from 'path';
import https from 'https';
import fs from 'fs/promises';
import compressing from 'compressing';

export default class SauceConnectLoader {
  constructor(options = {}) {
    const platform = getPlatform();
    const platformData = SAUCE_CONNECT_PLATFORM_DATA[platform];
    if (!platformData) {
      throw new ReferenceError(`Unsupported platform ${platform}`);
    }
    const {url, use} = platformData;
    this.url = format(url, options.sauceConnectVersion);
    this.destDir = join(__dirname, 'sc-loader');
    this.destSC = join(
      __dirname,
      'sc-loader',
      `.sc-v${options.sauceConnectVersion}`
    );
    this.path = join(this.destSC, use);
  }

  /**
   * Verify if SC was already downloaded,
   * if not then download it
   *
   * @api public
   */
  verifyAlreadyDownloaded() {
    return fs.stat(this.path).catch((err) => {
      if (err?.code === 'ENOENT') {
        return this._download();
      }
      throw err;
    });
  }

  /**
   * Download Sauce Connect
   */
  _download() {
    mkdirSync(this.destDir, {recursive: true});
    const compressedFilePath = join(this.destDir, basename(this.url));
    return new Promise((resolve, reject) => {
      const file = createWriteStream(compressedFilePath);
      https
        .get(this.url, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        })
        .on('error', (err) => {
          unlinkSync(compressedFilePath);
          reject(err);
        });
    }).then(() => {
      if (getPlatform() === 'linux') {
        return compressing.tgz
          .uncompress(compressedFilePath, this.destDir, {
            strip: 1,
          })
          .then(() => {
            const extractedDir = compressedFilePath.replace('.tar.gz', '');
            fs.rename(extractedDir, this.destSC).then(() => {
              // ensure the sc executable is actually executable
              return fs.chmod(this.path, 0o755);
            });
            // renameSync(extractedDir, this.destSC);
          });
      } else {
        return compressing.zip
          .uncompress(compressedFilePath, this.destSC, {
            strip: 1,
          })
          .then(() => {
            if (getPlatform() !== 'win32') {
              // ensure the sc executable is actually executable
              return fs.chmod(this.path, 0o755);
            }
          });
      }
    });
  }
}
