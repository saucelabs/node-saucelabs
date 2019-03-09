#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const { PROTOCOL_MAP } = require('../src/constants')
const { getParameters } = require('../src/utils')

let docs = `SauceLabs Interface
===================

The following commands are available via package or cli tool:

<table>
  <thead>
    <tr>
      <th width="50%">REST</td>
      <th width="50%">Node Wrapper</td>
    </tr>
  </thead>
  <tbody>
`

for (const [commandName, options] of PROTOCOL_MAP) {
    const params = getParameters(options.description.parameters)
    const requiredParams = params.filter((p) => p.required)
    const commandOptions = params.filter((p) => !p.required)
    const example = `api.${commandName}(${requiredParams.map((p) => p.name).join(', ')}${commandOptions.length ? ', { ...options }' : ''})`

    docs += '    <tr>\n'
    docs += '      <td>\n'
    docs += `        ${options.method.toUpperCase()} <code>${options.endpoint}</code><br>\n`
    docs += `        ${options.description.description || 'No description available.'}\n`
    docs += '      </td>\n'
    docs += '      <td>\n'
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
