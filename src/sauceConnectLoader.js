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
import {promises} from 'fs'
import {format} from 'util'
import {join, parse} from 'path'
import url from 'url'
import download from 'download'
import {SAUCE_CONNECT_PLATFORM_DATA} from './constants'

const {chmod, stat} = promises

export default class SauceConnectLoader {
    constructor(options = {}) {
        this.options = options
        this.scData = SAUCE_CONNECT_PLATFORM_DATA
            .filter(({os})=> os === process.platform)
            .map((platformData)=>({
                ...platformData,
                url: format(platformData.url, this.options.sauceConnectVersion),
                dest: join(__dirname, 'sc-loader', `.sc-v${this.options.sauceConnectVersion}`),
                path: join(__dirname, 'sc-loader', `.sc-v${this.options.sauceConnectVersion}`, platformData.use),
            }))[0]
    }

    /**
	 * Get path to the binary
	 *
	 * @api public
	 */
    path() {
        console.log('this.scData = ', this.scData)
        return this.scData.path
    }

    /**
	 * Verify if SC was already downloaded,
     * if not then download it
	 *
	 * @api public
	 */
    verifyAlreadyDownloaded() {
        return stat(this.path())
            .catch(error => {
                if (error && error.code === 'ENOENT') {
                    return this.download()
                }

                return Promise.reject(error)
            })
    }

    /**
	 * Download SC
	 *
	 * @api private
	 */
    download() {
        return download(this.scData.url, this.scData.dest,{
            extract: true,
            strip: 1,
        })
        .then((result) => {
            console.log('result = ', result)
            const resultingFiles = flatten(result.map((item, index) => {
                if (Array.isArray(item)) {
                    return item.map(file => file.path)
                }

                const parsedUrl = new url.URL(files[index].url)
                const parsedPath = parse(parsedUrl.pathname)

                return parsedPath.base
            }))

            return Promise.all(resultingFiles.map(fileName => {
                return chmod(join(this.dest(), fileName), 0o755)
            }))
        })
        .catch(e=> console.log('er = ', e))
    }
}

function flatten(arr) {
    return arr.reduce((acc, elem) => {
        if (Array.isArray(elem)) {
            acc.push(...elem)
        } else {
            acc.push(elem)
        }

        return acc
    }, [])
}
