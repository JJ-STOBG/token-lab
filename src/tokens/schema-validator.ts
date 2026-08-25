import Ajv2020, { type ErrorObject } from 'ajv/dist/2020'
import schema from '../schemas/token-configuration.schema.json'
import type { TokenConfiguration, ValidationIssue } from './token-types'

const ajv = new Ajv2020({ allErrors: true, strict: true })
const validate = ajv.compile(schema)

export function validateSourceSchema(configuration: unknown): ValidationIssue[] {
    if (validate(configuration)) return []
    return (validate.errors ?? []).map((error: ErrorObject) => ({
        code: 'schema-validation',
        severity: 'error' as const,
        path: error.instancePath || '/',
        message: `${error.instancePath || '/'} ${error.message ?? 'is invalid'}.`,
    }))
}

export function isSchemaValid(configuration: TokenConfiguration): boolean {
    return validateSourceSchema(configuration).length === 0
}
