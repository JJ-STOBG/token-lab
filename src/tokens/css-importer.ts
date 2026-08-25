import type { TokenConfiguration } from './token-types'

function tokenId(name: string, prefix: string): string {
    return name.slice(prefix.length).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export function importCssConfiguration(css: string, configurationId = 'imported-css'): TokenConfiguration {
    const declarations = [...css.matchAll(/(--[a-z0-9-]+-(?:primitives|semantic|functional|brand)-[a-z0-9-]+)\s*:\s*([^;{}]+)\s*;/gi)]
    const primitives: TokenConfiguration['primitives'] = {}
    const semanticTokens: TokenConfiguration['semanticTokens'] = {}
    const aliases: Record<string, string> = {}

    declarations.forEach(([, name, rawValue]) => {
        const value = rawValue.trim().toUpperCase()
        const primitiveMatch = name.match(/^--[a-z0-9-]+-primitives-([a-z0-9-]+)$/i)
        if (primitiveMatch && /^#[0-9A-F]{6}$/.test(value)) {
            const id = tokenId(name, name.slice(0, name.indexOf('-primitives-') + '-primitives-'.length))
            const group = id.split('-')[0]
            primitives[id] = { id, type: 'primitive', group: group.charAt(0).toUpperCase() + group.slice(1), value, label: id }
        }
    })

    declarations.forEach(([, name, rawValue]) => {
        const semanticMatch = name.match(/^--[a-z0-9-]+-(semantic|functional|brand)-([a-z0-9-]+)$/i)
        if (!semanticMatch) return
        const prefix = name.slice(0, name.indexOf(`-${semanticMatch[1]}-`) + semanticMatch[1].length + 2)
        const id = tokenId(name, prefix)
        const value = rawValue.trim()
        const primitiveReference = value.match(/^var\(--[a-z0-9-]+-primitives-([a-z0-9-]+)\)$/i)
        const semanticReference = value.match(/^var\(--[a-z0-9-]+-(?:semantic|functional|brand)-([a-z0-9-]+)\)$/i)
        if (primitiveReference) aliases[id] = tokenId(primitiveReference[1], '')
        else if (semanticReference) aliases[id] = tokenId(semanticReference[1], '')
        else if (/^#[0-9A-F]{6}$/i.test(value)) {
            const primitiveId = `imported-${id}`
            primitives[primitiveId] = { id: primitiveId, type: 'primitive', group: semanticMatch[1], value: value.toUpperCase(), label: primitiveId }
            aliases[id] = primitiveId
        }
    })

    const resolveAlias = (id: string, visited = new Set<string>()): string | undefined => {
        if (visited.has(id)) return undefined
        visited.add(id)
        return aliases[id] ? (primitives[aliases[id]] ? aliases[id] : resolveAlias(aliases[id], visited)) : undefined
    }
    Object.keys(aliases).forEach((id) => {
        const primitiveId = resolveAlias(id)
        if (primitiveId) semanticTokens[id] = { id, type: 'semantic', category: id.split('-')[0], mapsTo: primitiveId, label: id, description: `Imported from CSS: ${id}` }
    })

    const compatibilityAliases: Record<string, string> = { 'background-subtle': 'background-accent-subtle', 'text-on-brand': 'text-inverse', 'accent-brand': 'accent-default' }
    Object.entries(compatibilityAliases).forEach(([expectedId, sourceId]) => {
        if (!semanticTokens[expectedId] && semanticTokens[sourceId]) semanticTokens[expectedId] = { ...semanticTokens[sourceId], id: expectedId, label: expectedId, description: `Compatibility alias imported from CSS: ${sourceId}` }
    })

    return { schemaVersion: '1.0.0', configurationId, version: 'imported', primitives, semanticTokens }
}
