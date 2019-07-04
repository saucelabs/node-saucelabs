const fs = require('fs')
const path = require('path')
const changeCase = require('change-case')
const CodeGen = require('swagger-typescript-codegen').CodeGen
const prettier = require('prettier')

function generateTypingsForApi(file) {
    const swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'))
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
            .replace(/~~~(.*)~~~/g, (_, group) => changeCase.camel(group)),
        methods: methods
            .replace(/~~~(.*)~~~/g, (_, group) => changeCase.camel(group))
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

    const regions = Object.keys(require('../src/constants').REGION_MAPPING)
        .map(key => `"${key}"`)
        .join(' | ')

    let result = `
export interface SauceLabsOptions {
    user: string;
    key: string;
    region?: ${regions};
    headless?: boolean;
}`

    const methods = files.map((api) => {
        const typings = generateTypingsForApi('./apis/' + api)
        result += `\n\n ${typings.defintions}`

        return typings.methods
    }).join('\n\n')

    result += `\n\ndeclare class SauceLabs {\n
    constructor(options: SauceLabsOptions)\n\n
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
