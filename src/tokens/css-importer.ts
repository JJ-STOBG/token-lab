import type { TokenConfiguration } from './token-types'

function tokenId(name: string, prefix: string): string {
    return name.slice(prefix.length).replace(/-/g, '-')
}

export function importCssConfiguration(css: string, configurationId = 'imported-css'): TokenConfiguration {
    const declarations = [...css.matchAll(/(--token-lab-(?:primitives|semantic)-[a-z0-9-]+)\s*:\s*([^;{}]+)\s*;/gi)]
    const primitives: TokenConfiguration['primitives'] = {}
    const semanticTokens: TokenConfiguration['semanticTokens'] = {}

    declarations.forEach(([, name, rawValue]) => {
        const value = rawValue.trim().toUpperCase()
        if (name.startsWith('--token-lab-primitives-') && /^#[0-9A-F]{6}$/.test(value)) {
            const id = tokenId(name, '--token-lab-primitives-')
            const group = id.split('-')[0]
            primitives[id] = { id, type: 'primitive', group: group.charAt(0).toUpperCase() + group.slice(1), value, label: id }
        }
    })

    declarations.forEach(([, name, rawValue]) => {
        if (!name.startsWith('--token-lab-semantic-')) return
        const id = tokenId(name, '--token-lab-semantic-')
        const reference = rawValue.trim().match(/^var\(--token-lab-primitives-([a-z0-9-]+)\)$/i)
        if (!reference) return
        semanticTokens[id] = { id, type: 'semantic', category: id.split('-')[0], mapsTo: reference[1], label: id, description: `Imported from CSS: ${id}` }
    })

    return { schemaVersion: '1.0.0', configurationId, version: 'imported', primitives, semanticTokens }
}
