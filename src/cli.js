import yargs from 'yargs'

import { USAGE, CLI_PARAMS, EPILOG, PROTOCOL_MAP, DEFAULT_OPTIONS } from './constants'
import { getParameters } from './utils'
import SauceLabs from './'

export const run = () => {
    let argv = yargs.usage(USAGE)
        .epilog(EPILOG)
        .demandCommand()
        .help()

    for (const [commandName, options] of PROTOCOL_MAP) {
        const params = getParameters(options.description.parameters)
        const command = `${commandName} ${params.map((p) => (
            p.required ? `<${p.name}>` : `[${p.name}]`
        )).join(' ')}`

        const description = (
            options.description.summary ||
            options.description.description ||
            'Unknown description'
        )
        yargs.command(command.trim(), description, (yargs) => {
            for (const param of params) {
                const paramDescription = {
                    describe: param.description,
                    type: param.type
                }

                if (typeof param.default !== 'undefined') {
                    paramDescription.default = param.default
                }

                yargs.positional(param.name, paramDescription)
            }
        }, (argv) => {
            const { user, key, headless, region } = Object.assign({}, DEFAULT_OPTIONS, argv)
            const api = new SauceLabs({ user, key, headless, region })
            const requiredParams = params.filter((p) => p.required).map((p) => argv[p.name])
            api[commandName](...requiredParams, argv).then(
                (result) => {
                    /* istanbul ignore if */
                    if (typeof result === 'object') {
                        // eslint-disable-next-line no-console
                        return console.log(JSON.stringify(result, null, 4))
                    }

                    // eslint-disable-next-line no-console
                    console.log(result)
                },
                /* istanbul ignore next */
                (error) => {
                    // eslint-disable-next-line no-console
                    console.error(error)
                    process.exit(1)
                }
            )

            return api
        })
    }

    /**
     * populate cli arguments
     */
    for (const param of CLI_PARAMS) {
        argv = argv.option(param.name, param)
    }

    return argv.argv
}
