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
import {promises as fs} from 'fs';
import {format} from 'util';
import {join} from 'path';
import download from 'download';
import {SAUCE_CONNECT_PLATFORM_DATA} from './constants';
import {getPlatform} from './utils';

export default class SauceConnectLoader {
  constructor(options = {}) {
    const platform = getPlatform();
    const platformData = SAUCE_CONNECT_PLATFORM_DATA[platform];
    if (!platformData) {
      throw new ReferenceError(`Unsupported platform ${platform}`);
    }
    const {url, use} = platformData;
    this.url = format(url, options.sauceConnectVersion);
    this.dest = join(
      __dirname,
      'sc-loader',
      `.sc-v${options.sauceConnectVersion}`
    );
    this.path = join(this.dest, use);
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
   * Download SC
   *
   * @api private
   */
  _download() {
    return download(this.url, this.dest, {
      extract: true,
      strip: 1,
    }).then(() => {
      if (process.platform !== 'win32') {
        // ensure the sc executable is actually executable
        return fs.chmod(this.path, 0o755);
      }
    });
  }
}
