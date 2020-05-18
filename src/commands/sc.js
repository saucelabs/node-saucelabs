import SauceLabs from './..'
import { DEFAULT_OPTIONS, SAUCE_CONNECT_CLI_PARAMS } from '../constants'

export const command = 'sc [flags]'
export const describe = 'Sauce Connect interface'
export const builder = (yargs) => {
    for (const option of SAUCE_CONNECT_CLI_PARAMS) {
        yargs.option(option.name, option)
    }
}
export const handler = async (argv) => {
    const { user, key, headless, region, proxy } = Object.assign({}, DEFAULT_OPTIONS, argv)
    const api = new SauceLabs({ user, key, headless, region, proxy })
    return api.startSauceConnect(argv, true)
}
