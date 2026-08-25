import type { ConfigurationDiffEntry, ResolvedToken, TokenConfiguration } from './token-types'

export function resolveTokens(configuration: TokenConfiguration): Record<string, ResolvedToken> {
    return Object.fromEntries(Object.values(configuration.semanticTokens).map((token) => {
        const primitive = configuration.primitives[token.mapsTo]
        if (!primitive) throw new Error(`Missing primitive reference: ${token.id} -> ${token.mapsTo}`)
        if (token.allowedPrimitiveGroups && !token.allowedPrimitiveGroups.includes(primitive.group)) {
            throw new Error(`Disallowed primitive group: ${token.id} -> ${primitive.group}`)
        }
        return [token.id, { semanticTokenId: token.id, primitiveTokenId: primitive.id, value: primitive.value }]
    }))
}

export function diffConfigurations(official: TokenConfiguration, working: TokenConfiguration): ConfigurationDiffEntry[] {
    return Object.values(working.semanticTokens)
        .filter((token) => token.mapsTo !== official.semanticTokens[token.id]?.mapsTo)
        .map((token) => ({ semanticTokenId: token.id, officialPrimitiveTokenId: official.semanticTokens[token.id].mapsTo, workingPrimitiveTokenId: token.mapsTo }))
}
