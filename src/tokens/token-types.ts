export type TokenType = 'primitive' | 'semantic'

export interface PrimitiveToken {
    id: string
    type: 'primitive'
    group: string
    value: string
    label: string
}

export interface SemanticToken {
    id: string
    type: 'semantic'
    category: string
    mapsTo: string
    label: string
    description: string
    allowedPrimitiveGroups?: string[]
}

export interface TokenConfiguration {
    schemaVersion: string
    configurationId: string
    version: string
    primitives: Record<string, PrimitiveToken>
    semanticTokens: Record<string, SemanticToken>
}

export interface ResolvedToken {
    semanticTokenId: string
    primitiveTokenId: string
    value: string
}

export interface ConfigurationDiffEntry {
    semanticTokenId: string
    officialPrimitiveTokenId: string
    workingPrimitiveTokenId: string
}

export type ValidationSeverity = 'error' | 'warning'

export interface ValidationIssue {
    code: string
    severity: ValidationSeverity
    path: string
    message: string
}

export interface ValidationResult {
    valid: boolean
    errors: ValidationIssue[]
    warnings: ValidationIssue[]
}

export interface ExportArtifacts {
    json: string
    css: string
    manifest: ExportManifest
}

export interface ExportManifest {
    schemaVersion: string
    configurationId: string
    baselineVersion: string
    candidateVersion: string
    generatedAt: string
    mappings: Record<string, string>
    validationSummary: {
        errorCount: number
        warningCount: number
        accessibilityFailCount: number
        overrideReason?: string
    }
}

export interface ComponentDefinition {
    id: string
    name: string
    previewId: string
    tokenUsages: Array<{
        id: string
        semanticTokenId: string
        property: 'background' | 'text' | 'border' | 'icon' | 'focus' | 'other'
        description: string
    }>
}
