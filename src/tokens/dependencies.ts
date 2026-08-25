import type { ComponentDefinition, DependencyGraph } from './token-types'

export function buildDependencyGraph(components: ComponentDefinition[]): DependencyGraph {
    const bySemanticToken: Record<string, string[]> = {}
    const byComponent: Record<string, string[]> = {}
    components.forEach((component) => {
        const tokenIds = [...new Set(component.tokenUsages.map((usage) => usage.semanticTokenId))].sort()
        byComponent[component.id] = tokenIds
        tokenIds.forEach((tokenId) => { bySemanticToken[tokenId] = [...(bySemanticToken[tokenId] ?? []), component.id].sort() })
    })
    return { bySemanticToken, byComponent }
}