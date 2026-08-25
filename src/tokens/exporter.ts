import type { ExportArtifacts, TokenConfiguration } from './token-types'

function variableName(id: string): string {
    return `--stobg-${id.replace(/[^a-zA-Z0-9]+/g, '-')}`.toLowerCase()
}

export function exportConfiguration(configuration: TokenConfiguration): ExportArtifacts {
    const primitiveEntries = Object.values(configuration.primitives).sort((a, b) => a.id.localeCompare(b.id))
    const semanticEntries = Object.values(configuration.semanticTokens).sort((a, b) => a.id.localeCompare(b.id))
    const json = JSON.stringify({
        schemaVersion: configuration.schemaVersion,
        configurationId: configuration.configurationId,
        version: configuration.version,
        mappings: Object.fromEntries(semanticEntries.map((token) => [token.id, token.mapsTo])),
        primitives: Object.fromEntries(primitiveEntries.map((token) => [token.id, token.value])),
    }, null, 2)
    const cssLines = [':root {', ...primitiveEntries.map((token) => `  ${variableName(`primitives-${token.id}`)}: ${token.value};`), ...semanticEntries.map((token) => `  ${variableName(`semantic-${token.id}`)}: var(${variableName(`primitives-${token.mapsTo}`)});`), '}']
    return { json, css: cssLines.join('\n') }
}