import type { ResolvedToken, TokenConfiguration } from '../tokens/token-types'

interface GenericPreviewProps {
    working: TokenConfiguration
    resolved: Record<string, ResolvedToken>
    onSelectToken: (tokenId: string) => void
}

export function GenericPreview({ working, resolved, onSelectToken }: GenericPreviewProps) {
    const primitives = Object.values(working.primitives).sort((a, b) => a.id.localeCompare(b.id))
    const semantics = Object.values(working.semanticTokens).sort((a, b) => a.id.localeCompare(b.id))
    return <section className="preview-area generic-preview" aria-label="Generic token preview"><div className="preview-toolbar"><div><span className="eyebrow">GENERIC PREVIEW</span><h2>Token configuration / {working.configurationId}</h2></div><span className="generic-note">No built-in semantic contract detected</span></div><div className="preview-canvas"><div className="generic-canvas"><div className="generic-intro"><span className="preview-tag">PRIMITIVE PALETTE</span><h3>Explore your<br /><em>color system.</em></h3><p>Every imported primitive and semantic alias is available for inspection below.</p></div><div className="generic-scale">{primitives.map((primitive) => <button key={primitive.id} className="generic-swatch" onClick={() => { const semantic = semantics.find((token) => token.mapsTo === primitive.id); if (semantic) onSelectToken(semantic.id) }}><i style={{ backgroundColor: primitive.value }} /><strong>{primitive.id}</strong><small>{primitive.value}</small></button>)}</div><div className="generic-semantics"><span className="preview-tag">SEMANTIC TOKENS</span>{semantics.slice(0, 12).map((token) => <button key={token.id} onClick={() => onSelectToken(token.id)}><strong>{token.label}</strong><span>{token.id}</span><i style={{ backgroundColor: resolved[token.id].value }} /></button>)}</div></div></div></section>
}