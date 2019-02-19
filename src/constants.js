import changeCase from 'change-case'

const protocols = [
    require('../apis/sauce.json')
]

const protocolFlattened = new Map()
const parametersFlattened = new Map()
for (const { paths, parameters, host } of protocols) {
    for (const [name, description] of Object.entries(parameters)) {
        parametersFlattened.set(name, description)
    }

    for (const [endpoint, methods] of Object.entries(paths)) {
        for (const [method, description] of Object.entries(methods)) {
            protocolFlattened.set(
                changeCase.camelCase(description.operationId),
                { method, endpoint, description, host }
            )
        }
    }
}

export const PROTOCOL_MAP = protocolFlattened
export const PARAMETERS_MAP = parametersFlattened
