/**
 * Note:
 * This is a modified fork of https://github.com/kevva/bin-wrapper
 * The module had a CVE-2021-3795 vulnerability and decided to fork
 * and "simplify" the implementation
 */
import {promises} from 'fs'
import {join, parse} from 'path'
import url from 'url'
import download from 'download'
import osFilterObj  from 'os-filter-obj'

const {chmod, stat} = promises

export default class BinWrapper {
    constructor(options = {}) {
        this.options = options

        if (this.options.strip <= 0) {
            this.options.strip = 0
        } else if (!this.options.strip) {
            this.options.strip = 1
        }
    }

    /**
	 * Get or set files to download
	 *
	 * @param {String} src
	 * @param {String} os
	 * @param {String} arch
	 * @api public
	 */
    src(src, os, arch) {
        if (arguments.length === 0) {
            return this._src
        }

        this._src = this._src || []
        this._src.push({
            url: src,
            os,
            arch
        })

        return this
    }

    /**
	 * Get or set the destination
	 *
	 * @param {String} dest
	 * @api public
	 */
    dest(dest) {
        if (arguments.length === 0) {
            return this._dest
        }

        this._dest = dest
        return this
    }

    /**
	 * Get or set the binary
	 *
	 * @param {String} bin
	 * @api public
	 */
    use(bin) {
        if (arguments.length === 0) {
            return this._use
        }

        this._use = bin
        return this
    }

    /**
	 * Get path to the binary
	 *
	 * @api public
	 */
    path() {
        return join(this.dest(), this.use())
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
        const files = osFilterObj(this.src() || [])
        const urls = []

        if (files.length === 0) {
            return Promise.reject(new Error('No binary found matching your system. It\'s probably not supported.'))
        }

        files.forEach(file => urls.push(file.url))

        return Promise.all(urls.map(url => download(url, this.dest(), {
            extract: true,
            strip: this.options.strip
        }))).then(result => {
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
