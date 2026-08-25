import { describe, expect, it } from 'vitest'
import { contrastRatio, meetsContrast } from '../accessibility/contrast'
import { officialConfiguration } from './official'
import { exportConfiguration } from './exporter'
import { diffConfigurations, resolveTokens } from './resolver'
import { validateConfiguration } from './validator'
import { evaluateAccessibility } from '../accessibility/evaluator'
import { accessibilityRules } from '../accessibility/rules'

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
        expect(first.css.indexOf('--stobg-primitives-')).toBeLessThan(first.css.indexOf('--stobg-semantic-'))
        expect(exportConfiguration(working, 'Reviewed by design owner').manifest.validationSummary.overrideReason).toBe('Reviewed by design owner')
    })

    it('evaluates registered contrast rules from resolved tokens', () => {
        const results = evaluateAccessibility(accessibilityRules, resolveTokens(officialConfiguration))
        expect(results).toHaveLength(4)
        expect(results.find((result) => result.ruleId === 'form-label-contrast')?.status).toBe('pass')
        expect(results.every((result) => result.ratio > 0)).toBe(true)
    })
})