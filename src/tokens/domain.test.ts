import { describe, expect, it } from 'vitest'
import { contrastRatio, meetsContrast } from '../accessibility/contrast'
import { componentDefinitions, officialConfiguration } from './official'
import { exportConfiguration } from './exporter'
import { diffConfigurations, resolveTokens } from './resolver'
import { validateConfiguration } from './validator'
import { evaluateAccessibility } from '../accessibility/evaluator'
import { accessibilityRules } from '../accessibility/rules'
import { buildDependencyGraph } from './dependencies'
import { validateSourceSchema } from './schema-validator'
import { importCssConfiguration } from './css-importer'

describe('token domain', () => {
    it('resolves semantic tokens to primitive values', () => {
        const resolved = resolveTokens(officialConfiguration)
        expect(resolved['action-primary']).toEqual({ semanticTokenId: 'action-primary', primitiveTokenId: 'orange-500', value: '#F4A261' })
    })

    it('reports missing references and invalid primitive values', () => {
        const configuration = structuredClone(officialConfiguration)
        configuration.primitives['neutral-0'].value = '#fff'
        configuration.semanticTokens['text-primary'].mapsTo = 'missing'
        const result = validateConfiguration(configuration)
        expect(result.valid).toBe(false)
        expect(result.errors.map((issue) => issue.code)).toEqual(expect.arrayContaining(['invalid-color', 'missing-reference']))
    })

    it('returns path-specific schema errors for malformed source data', () => {
        const errors = validateSourceSchema({ schemaVersion: '1.0.0' })
        expect(errors.length).toBeGreaterThan(0)
        expect(errors.some((issue) => issue.path === '/')).toBe(true)
    })

    it('calculates known WCAG contrast values without display rounding', () => {
        expect(contrastRatio('#000000', '#FFFFFF')).toBe(21)
        expect(meetsContrast('#777777', '#FFFFFF', 4.5)).toBe(false)
        expect(meetsContrast('#000000', '#FFFFFF', 4.5)).toBe(true)
    })

    it('keeps diffs and exports deterministic', () => {
        const working = structuredClone(officialConfiguration)
        working.semanticTokens['accent-brand'].mapsTo = 'teal-600'
        expect(diffConfigurations(officialConfiguration, working)).toEqual([{ semanticTokenId: 'accent-brand', officialPrimitiveTokenId: 'cerulean-600', workingPrimitiveTokenId: 'teal-600' }])
        const first = exportConfiguration(working)
        const second = exportConfiguration(working)
        expect(first).toEqual(second)
        expect(first.css.indexOf('--token-lab-primitives-')).toBeLessThan(first.css.indexOf('--token-lab-semantic-'))
        expect(exportConfiguration(working, { overrideReason: 'Reviewed by design owner', accessibilityFailCount: 1 }).manifest.validationSummary.overrideReason).toBe('Reviewed by design owner')
        expect(exportConfiguration(working, { accessibilityFailCount: 1 }).manifest.validationSummary.accessibilityFailCount).toBe(1)
    })

    it('round-trips deterministic CSS token exports', () => {
        const imported = importCssConfiguration(exportConfiguration(officialConfiguration).css)
        expect(Object.keys(imported.primitives).length).toBeGreaterThan(30)
        expect(imported.semanticTokens['action-primary'].mapsTo).toBe('orange-500')
        expect(validateSourceSchema(imported).length).toBe(0)
    })

    it('imports namespaced CSS scales and semantic aliases', () => {
        const imported = importCssConfiguration(`:root { --stobg-primitives-neutral-1000: #030606; --stobg-primitives-cerulean-500: #467B9D; --stobg-semantic-accent-default: var(--stobg-primitives-cerulean-500); --stobg-semantic-background-accentSubtle: var(--stobg-primitives-cerulean-500); --stobg-semantic-text-inverse: var(--stobg-primitives-neutral-1000); }`)
        expect(imported.primitives['cerulean-500'].value).toBe('#467B9D')
        expect(imported.semanticTokens['accent-brand'].mapsTo).toBe('cerulean-500')
        expect(imported.semanticTokens['background-subtle'].mapsTo).toBe('cerulean-500')
    })

    it('evaluates registered contrast rules from resolved tokens', () => {
        const results = evaluateAccessibility(accessibilityRules, resolveTokens(officialConfiguration))
        expect(results).toHaveLength(7)
        expect(results.find((result) => result.ruleId === 'form-label-contrast')?.status).toBe('pass')
        expect(results.every((result) => result.ratio > 0)).toBe(true)
    })

    it('builds stable component dependencies from registered usages', () => {
        const graph = buildDependencyGraph(componentDefinitions)
        expect(graph.bySemanticToken['action-primary']).toEqual(['careers-hero', 'contact-form', 'homepage-hero', 'markets-hero'])
        expect(graph.byComponent['homepage-hero']).toEqual(['accent-brand', 'action-primary', 'text-on-brand'])
    })
})