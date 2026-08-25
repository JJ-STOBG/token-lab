import type { TokenConfiguration, ValidationIssue, ValidationResult } from './token-types'

const hexColor = /^#[0-9A-F]{6}$/

export function validateConfiguration(configuration: TokenConfiguration): ValidationResult {
    const errors: ValidationIssue[] = []
    const warnings: ValidationIssue[] = []
    const seenIds = new Set<string>()

    if (!configuration.schemaVersion || !configuration.configurationId || !configuration.version) {
        errors.push({ code: 'invalid-schema', severity: 'error', path: '/', message: 'Configuration metadata is incomplete.' })
    }

    Object.values(configuration.primitives).forEach((primitive) => {
        if (seenIds.has(primitive.id)) errors.push({ code: 'duplicate-id', severity: 'error', path: `/primitives/${primitive.id}`, message: `Duplicate token ID: ${primitive.id}.` })
        seenIds.add(primitive.id)
        if (!hexColor.test(primitive.value)) errors.push({ code: 'invalid-color', severity: 'error', path: `/primitives/${primitive.id}/value`, message: 'Primitive colors must use uppercase six-digit hex.' })
    })

    Object.values(configuration.semanticTokens).forEach((token) => {
        if (seenIds.has(token.id)) errors.push({ code: 'duplicate-id', severity: 'error', path: `/semanticTokens/${token.id}`, message: `Duplicate token ID: ${token.id}.` })
        seenIds.add(token.id)
        const primitive = configuration.primitives[token.mapsTo]
        if (!primitive) {
            errors.push({ code: 'missing-reference', severity: 'error', path: `/semanticTokens/${token.id}/mapsTo`, message: `Missing primitive reference: ${token.mapsTo}.` })
        } else if (token.allowedPrimitiveGroups && !token.allowedPrimitiveGroups.includes(primitive.group)) {
            errors.push({ code: 'disallowed-group', severity: 'error', path: `/semanticTokens/${token.id}/mapsTo`, message: `${token.mapsTo} is not allowed for ${token.id}.` })
        }
        if (!token.description) warnings.push({ code: 'missing-description', severity: 'warning', path: `/semanticTokens/${token.id}/description`, message: `${token.id} has no description.` })
    })

    return { valid: errors.length === 0, errors, warnings }
}