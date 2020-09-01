const fs = require('fs')
const path = require('path')
const { camelCase } = require('change-case')
const CodeGen = require('swagger-typescript-codegen').CodeGen
const prettier = require('prettier')

const {
    TS_IMPORTS, TS_SAUCELABS_OBJ, TC_SAUCE_CONNECT_CLASS,
    TC_SAUCE_CONNECT_OBJ, TC_START_SC
} = require('./constants')

function generateTypingsForApi(file) {
    const swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'))

    if (swagger.swagger !== '2.0') {
        return console.log(
            `Specification for ${file} has not the Swagger v2 format.\n` +
            'TypeScript generation currently is only supported for Swagger v2.0.'
        )
    }

    const definitions = CodeGen.getTypescriptCode({
        className: 'SauceLabs',
        swagger,
        template: {
            class: fs.readFileSync('./scripts/class-definitions.mustache', 'utf-8'),
            method: fs.readFileSync('./scripts/method.mustache', 'utf-8'),
        }
    })
    const methods = CodeGen.getTypescriptCode({
        className: 'SauceLabs',
        swagger,
        template: {
            class: fs.readFileSync('./scripts/class-methods.mustache', 'utf-8'),
            method: fs.readFileSync('./scripts/method.mustache', 'utf-8')
        }
    })

    return {
        defintions: definitions
            .replace(/~~~(.*)~~~/g, (_, group) => camelCase(group)),
        methods: methods
            .replace(/~~~(.*)~~~/g, (_, group) => camelCase(group))
    }
}

function sanitizeIndividualMethods(result) {
    const readBatchReport = `readBatchReport(
        body?: number | string
    ): Promise<BatchReport >`
    const junitStyleXmlReport = `junitStyleXmlReport(
        body?: number | string
    ): Promise<JunitXMLReport >`

    return result.replace(/readBatchReport\(\n([\s\S]*?)\): Promise<BatchReport >/, readBatchReport)
        .replace(/junitStyleXmlReport\(\n([\s\S]*?)\): Promise<JunitXMLReport >/, junitStyleXmlReport)
}

fs.readdir(path.join(__dirname, '../apis'), (err, files) => {
    if (err) {
        throw err
    }

    let result = `${TS_IMPORTS}\n${TS_SAUCELABS_OBJ}\n${TC_SAUCE_CONNECT_CLASS}\n${TC_SAUCE_CONNECT_OBJ}`
    const methods = [
        TC_START_SC,
        ...files
            .map((api) => generateTypingsForApi('./apis/' + api))
            .filter(Boolean)
            .map((typings) => {
                result += `\n\n ${typings.defintions}`
                return typings.methods
            })
    ].join('\n\n')

    result += `\n\ndeclare class SauceLabs {\n
    constructor(options: SauceLabsOptions)

    username: string;
    region: string;
    tld: string;
    headless: boolean;
    webdriverEndpoint: string;\n\n
    ${methods}
}

export default SauceLabs;`

    result = result.replace(/~PARAMSSTART~([\s\S]*?)~QPSTART~/g, '$1options?: {\n')
        .replace(/~QPEND~([^~]*?)~PARAMSEND~/g, '\n}$1')
        .replace(/(~QPEND~|~QPSTART~|~PARAMSEND~\n|~PARAMSSTART~)/g, '')

    result = result.replace(/ \| ResponseWithBody < (number|\d{3}), (Error|ErrorResponse|void) >/g, '')
        .replace(/Promise < ResponseWithBody < (?:\d{3}|number), ([\s\S]*?)>>\n(\n|})/g, 'Promise<$1>\n$2')

    // fix duplicate body params
    result = sanitizeIndividualMethods(result)

    fs.writeFileSync(
        'build/index.d.ts',
        prettier.format(result, {parser: 'typescript'}),
        { encoding: 'utf-8' }
    )
})
