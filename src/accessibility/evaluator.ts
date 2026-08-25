import { contrastRatio } from './contrast'
import type { AccessibilityRule } from './rules'
import type { ResolvedToken } from '../tokens/token-types'

export interface AccessibilityResult {
    ruleId: string
    componentId: string
    label: string
    foregroundTokenId: string
    backgroundTokenId: string
    foregroundValue: string
    backgroundValue: string
    ratio: number
    minimumRatio: number
    status: 'pass' | 'fail'
    message: string
}

export function evaluateAccessibility(rules: AccessibilityRule[], resolved: Record<string, ResolvedToken>): AccessibilityResult[] {
    return rules.map((rule) => {
        const foreground = resolved[rule.foregroundTokenId]
        const background = resolved[rule.backgroundTokenId]
        const ratio = contrastRatio(foreground.value, background.value)
        const passes = ratio >= rule.minimumRatio
        return {
            ruleId: rule.id,
            componentId: rule.componentId,
            label: rule.label,
            foregroundTokenId: rule.foregroundTokenId,
            backgroundTokenId: rule.backgroundTokenId,
            foregroundValue: foreground.value,
            backgroundValue: background.value,
            ratio,
            minimumRatio: rule.minimumRatio,
            status: passes ? 'pass' : 'fail',
            message: passes ? 'Meets automated contrast threshold.' : 'Below automated contrast threshold; review before export.',
        }
    })
}