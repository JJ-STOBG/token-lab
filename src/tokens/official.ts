import type { ComponentDefinition, TokenConfiguration } from './token-types'

export const officialConfiguration: TokenConfiguration = {
    schemaVersion: '1.0.0',
    configurationId: 'stobg-marketing',
    version: '2026.08',
    primitives: {
        'neutral-0': { id: 'neutral-0', type: 'primitive', group: 'Neutral', value: '#FFFFFF', label: 'White' },
        'neutral-950': { id: 'neutral-950', type: 'primitive', group: 'Neutral', value: '#14212B', label: 'Ink' },
        'cerulean-600': { id: 'cerulean-600', type: 'primitive', group: 'Cerulean', value: '#0067A5', label: 'Cerulean' },
        'cerulean-100': { id: 'cerulean-100', type: 'primitive', group: 'Cerulean', value: '#D9F0FA', label: 'Cerulean Mist' },
        'orange-500': { id: 'orange-500', type: 'primitive', group: 'Orange', value: '#F4A261', label: 'Signal Orange' },
        'teal-600': { id: 'teal-600', type: 'primitive', group: 'Teal', value: '#168A83', label: 'Teal' },
        'taupe-200': { id: 'taupe-200', type: 'primitive', group: 'Taupe', value: '#E7DED3', label: 'Taupe' },
    },
    semanticTokens: {
        'background-canvas': { id: 'background-canvas', type: 'semantic', category: 'Background', mapsTo: 'neutral-0', label: 'Canvas', description: 'Primary page background', allowedPrimitiveGroups: ['Neutral', 'Cerulean', 'Taupe'] },
        'background-subtle': { id: 'background-subtle', type: 'semantic', category: 'Background', mapsTo: 'cerulean-100', label: 'Subtle', description: 'Quiet section background', allowedPrimitiveGroups: ['Neutral', 'Cerulean', 'Taupe'] },
        'text-primary': { id: 'text-primary', type: 'semantic', category: 'Text', mapsTo: 'neutral-950', label: 'Primary', description: 'Main body and heading text', allowedPrimitiveGroups: ['Neutral', 'Cerulean'] },
        'text-on-brand': { id: 'text-on-brand', type: 'semantic', category: 'Text', mapsTo: 'neutral-0', label: 'On brand', description: 'Text on dark brand surfaces', allowedPrimitiveGroups: ['Neutral'] },
        'accent-brand': { id: 'accent-brand', type: 'semantic', category: 'Accent', mapsTo: 'cerulean-600', label: 'Brand accent', description: 'Primary STOBG brand signal', allowedPrimitiveGroups: ['Cerulean', 'Teal'] },
        'action-primary': { id: 'action-primary', type: 'semantic', category: 'Action', mapsTo: 'orange-500', label: 'Primary action', description: 'High-attention calls to action', allowedPrimitiveGroups: ['Orange', 'Teal'] },
        'border-subtle': { id: 'border-subtle', type: 'semantic', category: 'Border', mapsTo: 'taupe-200', label: 'Subtle border', description: 'Quiet dividers and card edges', allowedPrimitiveGroups: ['Neutral', 'Taupe', 'Cerulean'] },
    },
}

export const componentDefinitions: ComponentDefinition[] = [
    {
        id: 'homepage-hero', name: 'Homepage hero', previewId: 'homepage', tokenUsages: [
            { id: 'hero-surface', semanticTokenId: 'accent-brand', property: 'background', description: 'Hero surface' },
            { id: 'hero-heading', semanticTokenId: 'text-on-brand', property: 'text', description: 'Hero heading' },
            { id: 'hero-cta', semanticTokenId: 'action-primary', property: 'background', description: 'Hero CTA' },
        ]
    },
    {
        id: 'featured-projects', name: 'Featured projects', previewId: 'homepage', tokenUsages: [
            { id: 'projects-surface', semanticTokenId: 'background-subtle', property: 'background', description: 'Projects section' },
            { id: 'project-title', semanticTokenId: 'text-primary', property: 'text', description: 'Project title' },
            { id: 'project-border', semanticTokenId: 'border-subtle', property: 'border', description: 'Project card border' },
        ]
    },
    {
        id: 'contact-form', name: 'Contact form', previewId: 'contact', tokenUsages: [
            { id: 'form-surface', semanticTokenId: 'background-canvas', property: 'background', description: 'Form surface' },
            { id: 'form-label', semanticTokenId: 'text-primary', property: 'text', description: 'Form label' },
            { id: 'form-submit', semanticTokenId: 'action-primary', property: 'background', description: 'Submit button' },
        ]
    },
]
