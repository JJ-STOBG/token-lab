import type { ComponentDefinition, TokenConfiguration } from './token-types'

export const officialConfiguration: TokenConfiguration = {
    schemaVersion: '1.0.0',
    configurationId: 'sample-marketing',
    version: '2026.08',
    primitives: {
        'neutral-0': { id: 'neutral-0', type: 'primitive', group: 'Neutral', value: '#FFFFFF', label: 'White' },
        'neutral-50': { id: 'neutral-50', type: 'primitive', group: 'Neutral', value: '#F7F8F7', label: 'Neutral 50' },
        'neutral-100': { id: 'neutral-100', type: 'primitive', group: 'Neutral', value: '#E9ECEB', label: 'Neutral 100' },
        'neutral-200': { id: 'neutral-200', type: 'primitive', group: 'Neutral', value: '#D4DAD8', label: 'Neutral 200' },
        'neutral-400': { id: 'neutral-400', type: 'primitive', group: 'Neutral', value: '#9CA8A5', label: 'Neutral 400' },
        'neutral-600': { id: 'neutral-600', type: 'primitive', group: 'Neutral', value: '#5F6D6D', label: 'Neutral 600' },
        'neutral-700': { id: 'neutral-700', type: 'primitive', group: 'Neutral', value: '#46545A', label: 'Neutral 700' },
        'neutral-800': { id: 'neutral-800', type: 'primitive', group: 'Neutral', value: '#2D3B43', label: 'Neutral 800' },
        'neutral-900': { id: 'neutral-900', type: 'primitive', group: 'Neutral', value: '#1E2C34', label: 'Neutral 900' },
        'neutral-950': { id: 'neutral-950', type: 'primitive', group: 'Neutral', value: '#14212B', label: 'Ink' },
        'cerulean-50': { id: 'cerulean-50', type: 'primitive', group: 'Cerulean', value: '#F0FAFD', label: 'Cerulean 50' },
        'cerulean-600': { id: 'cerulean-600', type: 'primitive', group: 'Cerulean', value: '#0067A5', label: 'Cerulean' },
        'cerulean-100': { id: 'cerulean-100', type: 'primitive', group: 'Cerulean', value: '#D9F0FA', label: 'Cerulean Mist' },
        'cerulean-200': { id: 'cerulean-200', type: 'primitive', group: 'Cerulean', value: '#A9D7E8', label: 'Cerulean 200' },
        'cerulean-300': { id: 'cerulean-300', type: 'primitive', group: 'Cerulean', value: '#72B7D1', label: 'Cerulean 300' },
        'cerulean-400': { id: 'cerulean-400', type: 'primitive', group: 'Cerulean', value: '#3C96BA', label: 'Cerulean 400' },
        'cerulean-500': { id: 'cerulean-500', type: 'primitive', group: 'Cerulean', value: '#167DA8', label: 'Cerulean 500' },
        'cerulean-700': { id: 'cerulean-700', type: 'primitive', group: 'Cerulean', value: '#00527F', label: 'Cerulean 700' },
        'cerulean-800': { id: 'cerulean-800', type: 'primitive', group: 'Cerulean', value: '#003D5F', label: 'Cerulean 800' },
        'cerulean-900': { id: 'cerulean-900', type: 'primitive', group: 'Cerulean', value: '#002C45', label: 'Cerulean 900' },
        'orange-50': { id: 'orange-50', type: 'primitive', group: 'Orange', value: '#FFF8F1', label: 'Orange 50' },
        'orange-100': { id: 'orange-100', type: 'primitive', group: 'Orange', value: '#FDE5D0', label: 'Orange 100' },
        'orange-200': { id: 'orange-200', type: 'primitive', group: 'Orange', value: '#F9C49D', label: 'Orange 200' },
        'orange-300': { id: 'orange-300', type: 'primitive', group: 'Orange', value: '#F6AE79', label: 'Orange 300' },
        'orange-400': { id: 'orange-400', type: 'primitive', group: 'Orange', value: '#F49A58', label: 'Orange 400' },
        'orange-500': { id: 'orange-500', type: 'primitive', group: 'Orange', value: '#F4A261', label: 'Signal Orange' },
        'orange-600': { id: 'orange-600', type: 'primitive', group: 'Orange', value: '#D97B38', label: 'Orange 600' },
        'orange-700': { id: 'orange-700', type: 'primitive', group: 'Orange', value: '#B65C25', label: 'Orange 700' },
        'orange-800': { id: 'orange-800', type: 'primitive', group: 'Orange', value: '#8F421D', label: 'Orange 800' },
        'teal-50': { id: 'teal-50', type: 'primitive', group: 'Teal', value: '#EFFBF8', label: 'Teal 50' },
        'teal-100': { id: 'teal-100', type: 'primitive', group: 'Teal', value: '#CDEEE8', label: 'Teal 100' },
        'teal-200': { id: 'teal-200', type: 'primitive', group: 'Teal', value: '#9BD9D0', label: 'Teal 200' },
        'teal-300': { id: 'teal-300', type: 'primitive', group: 'Teal', value: '#65BEB5', label: 'Teal 300' },
        'teal-400': { id: 'teal-400', type: 'primitive', group: 'Teal', value: '#36A39B', label: 'Teal 400' },
        'teal-500': { id: 'teal-500', type: 'primitive', group: 'Teal', value: '#238F89', label: 'Teal 500' },
        'teal-600': { id: 'teal-600', type: 'primitive', group: 'Teal', value: '#168A83', label: 'Teal' },
        'teal-700': { id: 'teal-700', type: 'primitive', group: 'Teal', value: '#106F6B', label: 'Teal 700' },
        'teal-800': { id: 'teal-800', type: 'primitive', group: 'Teal', value: '#0C5654', label: 'Teal 800' },
        'teal-900': { id: 'teal-900', type: 'primitive', group: 'Teal', value: '#083F3E', label: 'Teal 900' },
        'taupe-50': { id: 'taupe-50', type: 'primitive', group: 'Taupe', value: '#FCFAF7', label: 'Taupe 50' },
        'taupe-100': { id: 'taupe-100', type: 'primitive', group: 'Taupe', value: '#F3EDE6', label: 'Taupe 100' },
        'taupe-200': { id: 'taupe-200', type: 'primitive', group: 'Taupe', value: '#E7DED3', label: 'Taupe' },
        'taupe-300': { id: 'taupe-300', type: 'primitive', group: 'Taupe', value: '#D1C2B3', label: 'Taupe 300' },
        'taupe-400': { id: 'taupe-400', type: 'primitive', group: 'Taupe', value: '#B6A494', label: 'Taupe 400' },
        'taupe-500': { id: 'taupe-500', type: 'primitive', group: 'Taupe', value: '#978372', label: 'Taupe 500' },
        'taupe-600': { id: 'taupe-600', type: 'primitive', group: 'Taupe', value: '#776658', label: 'Taupe 600' },
        'burgundy-50': { id: 'burgundy-50', type: 'primitive', group: 'Burgundy', value: '#FFF6F5', label: 'Burgundy 50' },
        'burgundy-100': { id: 'burgundy-100', type: 'primitive', group: 'Burgundy', value: '#F8DEDC', label: 'Burgundy 100' },
        'burgundy-300': { id: 'burgundy-300', type: 'primitive', group: 'Burgundy', value: '#D98F8A', label: 'Burgundy 300' },
        'burgundy-500': { id: 'burgundy-500', type: 'primitive', group: 'Burgundy', value: '#A84B50', label: 'Burgundy 500' },
        'burgundy-700': { id: 'burgundy-700', type: 'primitive', group: 'Burgundy', value: '#71323A', label: 'Burgundy 700' },
        'burgundy-900': { id: 'burgundy-900', type: 'primitive', group: 'Burgundy', value: '#481F29', label: 'Burgundy 900' },
    },
    semanticTokens: {
        'background-canvas': { id: 'background-canvas', type: 'semantic', category: 'Background', mapsTo: 'neutral-0', label: 'Canvas', description: 'Primary page background', allowedPrimitiveGroups: ['Neutral', 'Cerulean', 'Taupe'] },
        'background-subtle': { id: 'background-subtle', type: 'semantic', category: 'Background', mapsTo: 'cerulean-100', label: 'Subtle', description: 'Quiet section background', allowedPrimitiveGroups: ['Neutral', 'Cerulean', 'Taupe'] },
        'text-primary': { id: 'text-primary', type: 'semantic', category: 'Text', mapsTo: 'neutral-950', label: 'Primary', description: 'Main body and heading text', allowedPrimitiveGroups: ['Neutral', 'Cerulean'] },
        'text-on-brand': { id: 'text-on-brand', type: 'semantic', category: 'Text', mapsTo: 'neutral-0', label: 'On brand', description: 'Text on dark brand surfaces', allowedPrimitiveGroups: ['Neutral'] },
        'accent-brand': { id: 'accent-brand', type: 'semantic', category: 'Accent', mapsTo: 'cerulean-600', label: 'Brand accent', description: 'Primary brand signal', allowedPrimitiveGroups: ['Cerulean', 'Teal', 'Burgundy'] },
        'action-primary': { id: 'action-primary', type: 'semantic', category: 'Action', mapsTo: 'orange-500', label: 'Primary action', description: 'High-attention calls to action', allowedPrimitiveGroups: ['Orange', 'Teal', 'Burgundy'] },
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
    {
        id: 'markets-hero', name: 'Markets hero', previewId: 'markets', tokenUsages: [
            { id: 'markets-surface', semanticTokenId: 'accent-brand', property: 'background', description: 'Markets hero surface' },
            { id: 'markets-heading', semanticTokenId: 'text-on-brand', property: 'text', description: 'Markets heading' },
            { id: 'markets-cta', semanticTokenId: 'action-primary', property: 'background', description: 'Markets CTA' },
        ]
    },
    {
        id: 'project-detail-hero', name: 'Project detail hero', previewId: 'project-detail', tokenUsages: [
            { id: 'project-detail-surface', semanticTokenId: 'accent-brand', property: 'background', description: 'Project detail surface' },
            { id: 'project-detail-heading', semanticTokenId: 'text-on-brand', property: 'text', description: 'Project detail heading' },
        ]
    },
    {
        id: 'careers-hero', name: 'Careers hero', previewId: 'careers', tokenUsages: [
            { id: 'careers-surface', semanticTokenId: 'accent-brand', property: 'background', description: 'Careers hero surface' },
            { id: 'careers-heading', semanticTokenId: 'text-on-brand', property: 'text', description: 'Careers heading' },
            { id: 'careers-cta', semanticTokenId: 'action-primary', property: 'background', description: 'Careers CTA' },
        ]
    },
]
