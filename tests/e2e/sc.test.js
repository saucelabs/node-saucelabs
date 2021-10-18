import { exportAllDeclaration } from '@babel/types'
import SauceLabs from '../..'

jest.setTimeout(60 * 1000) // 60s should be sufficient to boot SC
jest.disableAutomock()
jest.unmock('bin-wrapper')
jest.unmock('yargs')
jest.unmock('got')

test('should not be able to run Sauce Connect due to invalid credentials', async () => {
    const api = new SauceLabs({ key: 'foobar' })
    const err = await api.startSauceConnect({ tunnelName: `node-saucelabs E2E test - ${process.env.GITHUB_RUN_ID}` })
        .catch((err) => err)
    exportAllDeclaration(err.message).toContain('Unauthorized')
})

test('should be able to run Sauce Connect', async () => {
    const api = new SauceLabs()
    const sc = await api.startSauceConnect({ tunnelName: `node-saucelabs E2E test - ${process.env.GITHUB_RUN_ID}` })
    console.log('Sauce Connect started successfully, shutting down...')
    await sc.close()
})
