import SauceLabs from 'saucelabs'

const api = new SauceLabs({
    region: 'eu',
    user: 'foo',
    key: 'foobar',
    proxy: {},
    headless: false
});

async function foobar () {
    const job = await api.getJobV1_1('foobar')
    console.log(job.selenium_version)
}
