import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import './App.css'
import { evaluateAccessibility } from './accessibility/evaluator'
import { accessibilityRules } from './accessibility/rules'
import { componentDefinitions, officialConfiguration } from './tokens/official'
import { exportConfiguration } from './tokens/exporter'
import { diffConfigurations, resolveTokens } from './tokens/resolver'
import { buildDependencyGraph } from './tokens/dependencies'
import type { TokenConfiguration } from './tokens/token-types'
import { validateConfiguration } from './tokens/validator'
import { importCssConfiguration } from './tokens/css-importer'
import { PreviewWorkspace } from './previews/PreviewWorkspace'

function App() {
  const recoveryKey = 'design-token-lab:working:v1'
  const [baseline, setBaseline] = useState<TokenConfiguration>(officialConfiguration)
  const [working, setWorking] = useState<TokenConfiguration>(() => {
    const saved = localStorage.getItem(recoveryKey)
    if (!saved) return structuredClone(officialConfiguration)
    try {
      const recovered = JSON.parse(saved) as TokenConfiguration
      return validateConfiguration(recovered).valid ? recovered : structuredClone(officialConfiguration)
    } catch {
      return structuredClone(officialConfiguration)
    }
  })
  const [recovered, setRecovered] = useState(() => Boolean(localStorage.getItem(recoveryKey)))
  const [selectedTokenId, setSelectedTokenId] = useState('action-primary')
  const [selectedComponentId, setSelectedComponentId] = useState('homepage-hero')
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<TokenConfiguration[]>([])
  const [future, setFuture] = useState<TokenConfiguration[]>([])
  const [changedOnly, setChangedOnly] = useState(false)
  const [comparisonEnabled, setComparisonEnabled] = useState(false)
  const [validationEnabled, setValidationEnabled] = useState(false)
  const [overrideReason, setOverrideReason] = useState('')
  const [importMessage, setImportMessage] = useState('')
  const resolved = useMemo(() => resolveTokens(working), [working])
  const changes = useMemo(() => diffConfigurations(baseline, working), [baseline, working])
  const validation = useMemo(() => validateConfiguration(working), [working])
  const allAccessibilityResults = useMemo(() => evaluateAccessibility(accessibilityRules, resolved), [resolved])
  const accessibilityFailures = allAccessibilityResults.filter((result) => result.status === 'fail')
  const artifacts = useMemo(() => exportConfiguration(working, { overrideReason, errorCount: validation.errors.length, warningCount: validation.warnings.length, accessibilityFailCount: accessibilityFailures.length }), [accessibilityFailures.length, overrideReason, validation.errors.length, validation.warnings.length, working])
  const accessibilityResults = useMemo(() => evaluateAccessibility(accessibilityRules.filter((rule) => rule.componentId === selectedComponentId), resolved), [resolved, selectedComponentId])
  const selectedToken = working.semanticTokens[selectedTokenId]
  const selectedComponent = componentDefinitions.find((component) => component.id === selectedComponentId) ?? componentDefinitions[0]
  const filteredTokens = Object.values(working.semanticTokens).filter((token) =>
    `${token.label} ${token.category} ${token.id}`.toLowerCase().includes(query.toLowerCase()),
  ).filter((token) => !changedOnly || token.mapsTo !== baseline.semanticTokens[token.id].mapsTo)
  const componentUsages = selectedComponent.tokenUsages.map((usage) => ({ usage, token: working.semanticTokens[usage.semanticTokenId], resolved: resolved[usage.semanticTokenId] }))

  useEffect(() => { localStorage.setItem(recoveryKey, JSON.stringify(working)) }, [recoveryKey, working])

  function updateMapping(primitiveId: string) {
    if (primitiveId === selectedToken.mapsTo) return
    setHistory((items) => [...items, working])
    setFuture([])
    setWorking({ ...working, semanticTokens: { ...working.semanticTokens, [selectedTokenId]: { ...selectedToken, mapsTo: primitiveId } } })
  }

  function undo() {
    const previous = history.at(-1)
    if (!previous) return
    setFuture((items) => [...items, working])
    setWorking(previous)
    setHistory((items) => items.slice(0, -1))
  }

  function redo() {
    const next = future.at(-1)
    if (!next) return
    setHistory((items) => [...items, working])
    setWorking(next)
    setFuture((items) => items.slice(0, -1))
  }

  function reset() {
    setHistory([])
    setFuture([])
    setWorking(structuredClone(baseline))
  }

  function importTokens(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const candidate = file.name.toLowerCase().endsWith('.css')
          ? importCssConfiguration(String(reader.result), file.name.replace(/\.css$/i, ''))
          : JSON.parse(String(reader.result)) as TokenConfiguration
        const requiredIds = ['accent-brand', 'action-primary', 'background-subtle', 'background-canvas', 'text-primary', 'text-on-brand']
        const result = validateConfiguration(candidate)
        if (!result.valid) throw new Error(result.errors[0]?.message ?? 'Token configuration is invalid.')
        const missing = requiredIds.filter((id) => !candidate.semanticTokens[id])
        if (missing.length) throw new Error(`Preview-compatible tokens missing: ${missing.join(', ')}.`)
        setBaseline(structuredClone(candidate))
        setWorking(structuredClone(candidate))
        setHistory([])
        setFuture([])
        setSelectedTokenId(requiredIds.find((id) => candidate.semanticTokens[id]) ?? Object.keys(candidate.semanticTokens)[0])
        setImportMessage(`Loaded ${file.name}`)
      } catch (error) {
        setImportMessage(error instanceof Error ? error.message : 'Unable to load token configuration.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  function discardRecovery() {
    localStorage.removeItem(recoveryKey)
    setRecovered(false)
    reset()
  }

  async function copyArtifact(kind: 'json' | 'css') {
    if (!validation.valid || (accessibilityFailures.length > 0 && !overrideReason.trim())) return
    await navigator.clipboard.writeText(artifacts[kind])
  }

  function downloadArtifact(kind: 'json' | 'css') {
    if (!validation.valid || (accessibilityFailures.length > 0 && !overrideReason.trim())) return
    const content = artifacts[kind]
    const type = kind === 'json' ? 'application/json' : 'text/css'
    const filename = kind === 'json' ? 'working-tokens.json' : 'working-tokens.css'
    const url = URL.createObjectURL(new Blob([content], { type }))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">T</span><div><strong>TOKEN</strong><span>Design System Lab</span></div></div>
        <div className="baseline"><span className="eyebrow">BASELINE</span><strong>v{baseline.version}</strong><span className="status-dot" /> <span className="working-label">Working state {changes.length ? 'changed' : 'clean'}</span></div>
        <div className="actions"><label className="upload-button">Upload tokens<input type="file" accept="application/json,.json,text/css,.css" onChange={importTokens} /></label><button onClick={undo} disabled={!history.length}>Undo</button><button onClick={redo} disabled={!future.length}>Redo</button><button onClick={reset} disabled={!changes.length}>Reset</button><button className={comparisonEnabled ? 'compare-button active' : 'compare-button'} onClick={() => setComparisonEnabled((enabled) => !enabled)}>Compare</button><button className={validationEnabled ? 'compare-button active' : 'compare-button'} onClick={() => setValidationEnabled((enabled) => !enabled)}>Validation</button><button className="export-button" onClick={() => copyArtifact('json')} disabled={!validation.valid || (accessibilityFailures.length > 0 && !overrideReason.trim())}>Copy JSON</button><button className="export-button" onClick={() => copyArtifact('css')} disabled={!validation.valid || (accessibilityFailures.length > 0 && !overrideReason.trim())}>Copy CSS</button><button className="export-button" onClick={() => downloadArtifact('json')} disabled={!validation.valid || (accessibilityFailures.length > 0 && !overrideReason.trim())}>Export JSON</button><button className="export-button" onClick={() => downloadArtifact('css')} disabled={!validation.valid || (accessibilityFailures.length > 0 && !overrideReason.trim())}>Export CSS</button></div>
      </header>
      {importMessage && <div className="import-message" role="status">{importMessage}</div>}
      {recovered && <div className="recovery-banner" role="status"><span>Recovered working state from this browser.</span><button onClick={discardRecovery}>Discard recovery</button></div>}

      <main className="workspace">
        <aside className="token-panel" aria-label="Token browser">
          <div className="panel-heading"><div><span className="eyebrow">GOVERNANCE</span><h1>Token browser</h1></div><span className="count">{filteredTokens.length}</span></div>
          <label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tokens" aria-label="Search tokens" /></label>
          <div className="filter-row"><button className={!changedOnly ? 'filter active' : 'filter'} onClick={() => setChangedOnly(false)}>All tokens</button><button className={changedOnly ? 'filter active' : 'filter'} onClick={() => setChangedOnly(true)}>Changed</button></div>
          <div className="token-list">
            {filteredTokens.map((token) => { const changed = token.mapsTo !== baseline.semanticTokens[token.id].mapsTo; return <button key={token.id} className={`token-row ${selectedTokenId === token.id ? 'selected' : ''}`} onClick={() => setSelectedTokenId(token.id)}><span className="swatch" style={{ backgroundColor: resolved[token.id].value }} /><span className="token-copy"><strong>{token.label}</strong><small>{token.category} / {token.id}</small></span>{changed && <span className="changed" aria-label="Changed">●</span>}</button> })}
          </div>
          <div className="panel-foot"><span className="legend-dot changed" /> Working changes <strong>{changes.length}</strong></div>
        </aside>

        <PreviewWorkspace resolved={resolved} onSelectComponent={setSelectedComponentId} />

        <aside className="inspector" aria-label="Component inspector"><div className="inspector-title"><div><span className="eyebrow">INSPECTOR</span><h2>{selectedComponent.name}</h2></div><span className="inspect-icon">⌘</span></div><p className="muted">Registered usage chain · {selectedComponent.previewId}</p><div className="usage-list">{componentUsages.map(({ usage, token, resolved: value }) => <button className="usage" key={usage.id} onClick={() => setSelectedTokenId(usage.semanticTokenId)}><div className="usage-head"><strong>{usage.description}</strong><span>{usage.property}</span></div><div className="chain"><span>{token.id}</span><b>→</b><span>{value.primitiveTokenId}</span><b>→</b><i style={{ backgroundColor: value.value }} /> <code>{value.value}</code></div></button>)}</div><div className="inspector-section"><span className="eyebrow">SELECTED TOKEN</span><h3>{selectedToken.label}</h3><p className="muted">{selectedToken.description}</p><div className="mapping-line"><span className="swatch large" style={{ backgroundColor: resolved[selectedTokenId].value }} /><div><small>RESOLVES TO</small><strong>{resolved[selectedTokenId].primitiveTokenId}</strong></div><code>{resolved[selectedTokenId].value}</code></div><label className="mapping-label" htmlFor="mapping">Working mapping <small>{selectedToken.allowedPrimitiveGroups?.join(' · ')} scale</small><select id="mapping" value={selectedToken.mapsTo} onChange={(event) => updateMapping(event.target.value)}>{Object.values(working.primitives).filter((primitive) => !selectedToken.allowedPrimitiveGroups || selectedToken.allowedPrimitiveGroups.includes(primitive.group)).map((primitive) => <option key={primitive.id} value={primitive.id}>{primitive.id} · {primitive.value}</option>)}</select></label></div><div className="accessibility"><span className="eyebrow">ACCESSIBILITY RESULTS</span>{accessibilityResults.map((result) => <div className={`contrast-result ${result.status}`} key={result.ruleId}><span>{result.status === 'pass' ? '✓' : '!'}</span><div><strong>{result.label} · {result.status}</strong><small>{result.ratio.toFixed(2)}:1 / {result.minimumRatio}:1 required</small></div></div>)}</div><div className="accessibility validation-block"><span className="eyebrow">VALIDATION SNAPSHOT</span><div className={`pass ${validation.valid ? '' : 'validation-error'}`}><span>{validation.valid ? '✓' : '!'}</span><div><strong>{validation.valid ? 'Configuration valid' : `${validation.errors.length} blocking error${validation.errors.length > 1 ? 's' : ''}`}</strong><small>{validation.warnings.length ? `${validation.warnings.length} warning${validation.warnings.length > 1 ? 's' : ''} · ` : ''}Export is {validation.valid ? 'ready' : 'blocked'}.</small></div></div></div></aside>
      </main>
      <DependencyImpact tokenId={selectedTokenId} />
      {comparisonEnabled && <section className="comparison-drawer" aria-label="Official versus working comparison"><div><span className="eyebrow">COMPARISON</span><h2>Official versus working</h2></div><button className="close-comparison" onClick={() => setComparisonEnabled(false)} aria-label="Close comparison">×</button><div className="comparison-summary"><strong>{changes.length}</strong><span>changed mapping{changes.length === 1 ? '' : 's'}</span></div><div className="diff-list">{changes.length === 0 ? <p className="muted">Working state matches the official baseline.</p> : changes.map((change) => <button key={change.semanticTokenId} className="diff-row" onClick={() => { setSelectedTokenId(change.semanticTokenId); setComparisonEnabled(false) }}><strong>{change.semanticTokenId}</strong><span>{change.officialPrimitiveTokenId}</span><b>→</b><span className="working-value">{change.workingPrimitiveTokenId}</span></button>)}</div></section>}
      {validationEnabled && <section className="comparison-drawer validation-drawer" aria-label="Validation details"><div><span className="eyebrow">VALIDATION</span><h2>Export readiness</h2></div><button className="close-comparison" onClick={() => setValidationEnabled(false)} aria-label="Close validation">×</button><div className="validation-summary"><span className={validation.valid ? 'summary-good' : 'summary-bad'}>{validation.errors.length} errors</span><span>{validation.warnings.length} warnings</span><span>{accessibilityFailures.length} contrast failures</span></div>{validation.errors.map((issue) => <div className="issue error" key={`${issue.code}-${issue.path}`}><strong>{issue.code}</strong><span>{issue.message}</span></div>)}{accessibilityFailures.length > 0 && <div className="override-box"><strong>Accessibility override required</strong><p>Automated failures remain visible in the manifest and are never silently downgraded.</p><label htmlFor="override-reason">Reason for exporting with failures<textarea id="override-reason" value={overrideReason} onChange={(event) => setOverrideReason(event.target.value)} placeholder="Record the review decision" rows={3} /></label></div>}<p className="validation-note">{validation.valid && (!accessibilityFailures.length || overrideReason.trim()) ? 'Exports are ready.' : 'Exports are blocked until blocking issues are resolved.'}</p></section>}
      <div className="live-region" role="status" aria-live="polite">{changes.length ? `${changes.length} working mapping${changes.length > 1 ? 's' : ''} changed` : 'Official baseline active'}</div>
    </div>
  )
}

export default App

function DependencyImpact({ tokenId }: { tokenId: string }) {
  const graph = buildDependencyGraph(componentDefinitions)
  const componentIds = graph.bySemanticToken[tokenId] ?? []
  return <section className="dependency-strip" aria-label="Dependency impact"><span className="eyebrow">DEPENDENCY IMPACT</span><strong>{tokenId}</strong><span className="dependency-copy">used by {componentIds.length} registered component{componentIds.length === 1 ? '' : 's'}</span><div className="dependency-chips">{componentIds.length ? componentIds.map((componentId) => <span key={componentId}>{componentId}</span>) : <span>no registered usages</span>}</div></section>
}
