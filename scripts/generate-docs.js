#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const { PROTOCOL_MAP } = require('../src/constants')
const { getParameters } = require('../src/utils')

let docs = `SauceLabs Interface
===================

The following commands are available via package or cli tool:

<table>
  <tbody>
`

for (const [commandName, options] of PROTOCOL_MAP) {
    const params = getParameters(options.description.parameters)
    const requiredParams = params.filter((p) => p.required)
    const commandOptions = params.filter((p) => !p.required)
    const inlineParameters = requiredParams.map((p) => p.name).join(', ')
    const separator = inlineParameters && commandOptions.length ? ', ' : ''
    const example = `api.${commandName}(${inlineParameters}${separator}${commandOptions.length ? '{ ...options }' : ''})`

    docs += '    <tr>\n'
    docs += '      <td>\n'
    docs += `        <b>${options.method.toUpperCase()}</b> <code>${options.endpoint}</code><br>\n`
    docs += `        ${options.description.description || 'No description available.'}\n`
    docs += '        <h3>Example:</h3>\n'
    docs += `        <code>${example}</code>\n`

    if (commandOptions.length) {
        docs += '        <br><h4>Options</h4>\n'
        docs += '        <ul>'

        for (const option of commandOptions) {
            docs += `          <li><b>${option.name}</b>: ${option.description || 'No description available.'}</li>`
        }

        docs += '        </ul>'
    }

    docs += '      </td>\n'
    docs += '    </tr>\n'
}

docs += '  </tbody>'
docs += '</table>'

fs.writeFileSync(
    path.join(__dirname, '..', 'docs', 'interface.md'),
    docs,
    { encoding: 'utf-8' }
)
