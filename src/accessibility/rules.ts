export interface AccessibilityRule {
    id: string
    componentId: string
    label: string
    foregroundTokenId: string
    backgroundTokenId: string
    minimumRatio: number
    classification: 'normal-text' | 'large-text' | 'ui-component' | 'graphic'
}

export const accessibilityRules: AccessibilityRule[] = [
    { id: 'hero-heading-contrast', componentId: 'homepage-hero', label: 'Hero heading', foregroundTokenId: 'text-on-brand', backgroundTokenId: 'accent-brand', minimumRatio: 4.5, classification: 'normal-text' },
    { id: 'hero-cta-contrast', componentId: 'homepage-hero', label: 'Hero CTA label', foregroundTokenId: 'text-primary', backgroundTokenId: 'action-primary', minimumRatio: 4.5, classification: 'normal-text' },
    { id: 'project-title-contrast', componentId: 'featured-projects', label: 'Project title', foregroundTokenId: 'text-primary', backgroundTokenId: 'background-subtle', minimumRatio: 4.5, classification: 'normal-text' },
    { id: 'form-label-contrast', componentId: 'contact-form', label: 'Form label', foregroundTokenId: 'text-primary', backgroundTokenId: 'background-canvas', minimumRatio: 4.5, classification: 'normal-text' },
]