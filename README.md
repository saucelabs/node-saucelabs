<p align="center">
    <img src="./assets/trophy-bot.png" alt="Trophy bot" />
</p>

# Node Sauce Labs [![Test Changes](https://github.com/saucelabs/node-saucelabs/actions/workflows/test.yml/badge.svg)](https://github.com/saucelabs/node-saucelabs/actions/workflows/test.yml)

Wrapper around all Sauce Labs REST APIs for [Node.js](http://nodejs.org/) (v8 or higher) including support for [Sauce Connect Proxy](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy) and TypeScript definitions.

## Install

To install the package run:

```shell
npm install saucelabs
```

## Options

### user

Your Sauce Labs username.

Type: `string`<br>
Default: `process.env.SAUCE_USERNAME`

### key

Your Sauce Labs access key.

Type: `string`<br>
Default: `process.env.SAUCE_ACCESS_KEY`

### region

Your Sauce Labs datacenter region. The following regions are available:

- `us-west-1` (short `us`)
- `eu-central-1` (short `eu`)
- `us-east-1` (headless)

Type: `string`<br>
Default: `us`

### headless

If set to true you are accessing the headless Sauce instances (this discards the `region` option).

Type: `boolean`<br>
Default: `false`

### proxy

If you want to tunnel your API request through a proxy please provide your proxy URL.

Type: `string`<br>
Default: `null`

### headers

If you want to set request headers, as example {'User-Agent': 'node-saucelabs'}

Type: `object`<br>
Default: `{'User-Agent': 'saucelabs/<VERSION> (nodejs <PLATFORM>)'}`

## Usage

All accessible API commands with descriptions can be found [here](docs/interface.md).

### As CLI Tool

This package if installed globally can be used as CLI tool to access the API from the command line:

```sh
$ npm install -g saucelabs
...
$ sl listJobs $SAUCE_USERNAME --limit 5 --region eu
{ jobs:
   [ { id: '19dab74f8fd848518f8d2c2cee3a6fbd' },
     { id: 'dc08ca0c7fa14eee909a093d11567328' },
     { id: '5bc6f70c777b4ae3bf7909a40f5ee41b' },
     { id: 'f40fe7b044754eaaa5f5a130406549b5' },
     { id: 'd1553f71f910402893f1e82a4dcb6ca6' } ] }
```

You can find all available commands and options with description by calling:

```sh
$ sl --help
# show description for specific command
$ sl listJobs --help
```

or update the job status by calling:

```sh
$ sl updateJob cb-onboarding 690c5877710c422d8be4c622b40c747f "{\"passed\":false}"
```

or download a job asset:

```sh
$ sl downloadJobAsset 690c5877710c422d8be4c622b40c747f video.mp4 --filepath ./video.mp4
```

or upload a job asset:

```sh
$ sl uploadJobAssets 690c5877710c422d8be4c622b40c747f --files ./video.mp4 --files ./log.json
```

or start Sauce Connect Proxy in EU datacenter:

```sh
# start Sauce Connect tunnel for eu-central-1 region
$ sl sc --region eu --tunnel-identifier "my-tunnel"
# run a specific Sauce Connect version
$ sl sc --scVersion 4.5.4
# see all available Sauce Connect parameters via:
$ sl sc --help
```

You can see all available Sauce Connect parameters on the [Sauce Labs Wiki Page](https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy+Command-Line+Quick+Reference+Guide).

### As NPM Package

The following example shows how to access details of the last job you were running with your account that is being exposed as environment variables as `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY`. Alternatively you can pass the credentials via `options` to the constructor:

```js
import SauceLabs from 'saucelabs';
// if imports are not supported by your Node.js version, import the package as follows:
// const SauceLabs = require('saucelabs').default;

(async () => {
    const myAccount = new SauceLabs();
    // using constructor options
    // const myAccount = new SauceLabs({ user: "YOUR-USER", key: "YOUR-ACCESS-KEY"});

    // get full webdriver url from the client depending on region:
    console.log(myAccount.webdriverEndpoint) // outputs "https://ondemand.us-west-1.saucelabs.com/"

    // get job details of last run job
    const jobs = await myAccount.listJobs(
        process.env.SAUCE_USERNAME,
        { limit: 1, full: true }
    );

    console.log(jobs);
    /**
     * outputs:
     * { jobs:
        [ { browser_short_version: '72',
            video_url:
             'https://assets.saucelabs.com/jobs/dc08ca0c7fa14eee909a093d11567328/video.flv',
            creation_time: 1551711453,
            'custom-data': null,
            browser_version: '72.0.3626.81',
            owner: '<username-redacted>',
            id: 'dc08ca0c7fa14eee909a093d11567328',
            record_screenshots: true,
            record_video: true,
            build: null,
            passed: null,
            public: 'team',
            end_time: 1551711471,
            status: 'complete',
            log_url:
             'https://assets.saucelabs.com/jobs/dc08ca0c7fa14eee909a093d11567328/selenium-server.log',
            start_time: 1551711454,
            proxied: false,
            modification_time: 1551711471,
            tags: [],
            name: null,
            commands_not_successful: 1,
            consolidated_status: 'complete',
            manual: false,
            assigned_tunnel_id: null,
            error: null,
            os: 'Windows 2008',
            breakpointed: null,
            browser: 'googlechrome' } ] }
     */

    /**
     * start Sauce Connect Proxy
     */
    const sc = await myAccount.startSauceConnect({
        /**
         * you can pass in a `logger` method to print Sauce Connect log messages
         */
        logger: (stdout) => console.log(stdout),
        /**
         * see all available parameters here: https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy+Command-Line+Quick+Reference+Guide
         * all parameters have to be applied camel cased instead of with hyphens, e.g.
         * to apply the `--tunnel-identifier` parameter, set:
         */
        tunnelIdentifier: 'my-tunnel'
    })

    // run a test
    // ...

    // close Sauce Connect
    await sc.close()

    // upload additional log files and attach it to your Sauce job
    await myAccount.uploadJobAssets(
        '76e693dbe6ff4910abb0bc3d752a971e',
        [
            // either pass in file names
            './logs/video.mp4', './logs/log.json',
            // or file objects
            {
                filename: 'myCustomLogFile.json',
                data: {
                    someLog: 'data'
                }
            }
        ]
    )
})()
```

> You may wonder why `listJobs` requires a `username` as first parameter since you've already defined the process.env. The reason for this is that Sauce Labs supports a concept of Team Accounts, so-called sub-accounts, grouped together. As such functions like the mentioned could list jobs not only for the requesting account, but also for the individual team account. Learn more about it [here](https://wiki.saucelabs.com/display/DOCS/Managing+Team+Members+and+Accounts)

### `webdriverEndpoint` property

You can use the `webdriverEndpoint` property of the client to get the full WebDriver endpoint to connect to Sauce Labs, e.g.:

```js
const myAccount = new SauceLabs({
    user: "YOUR-USER",
    key: "YOUR-ACCESS-KEY",
    region: 'eu' // run in EU datacenter
});

// get full webdriver url from the client depending on `region` and `headless` option:
console.log(myAccount.webdriverEndpoint);
// outputs: "https://ondemand.eu-central-1.saucelabs.com/"
```

---

This module was originally created by [Dan Jenkins](https://github.com/danjenkins) with the help of multiple contributors ([Daniel Perez Alvarez](https://github.com/unindented), [Mathieu Sabourin](https://github.com/OniOni), [Michael J Feher](https://github.com/PhearZero), and many more). We would like to thank Dan and all contributors for their support and this beautiful module.
