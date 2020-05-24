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

    const sc = await api.startSauceConnect({
        scVersion: '4.5.4',
        tunnelIdentifier: '1234',
        logger: (output) => console.log(output)
    })
    sc.cp.pid
    await sc.close()

    await api.downloadJobAsset( 'job_id', 'video.mp4')
    await api.downloadJobAsset( 'job_id', 'video.mp4', './video.mp4')
}
