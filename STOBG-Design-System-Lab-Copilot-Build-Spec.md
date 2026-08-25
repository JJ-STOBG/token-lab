# STOBG Design System Lab - Copilot Build Specification

## Purpose

Build a production-quality internal web application named **STOBG Design System Lab**. The application is a safe environment for exploring, validating, and governing STOBG color-token mappings before those mappings reach production websites.

Treat this as a **token governance application with experimentation capabilities**. The application must make every rendered color traceable, keep the approved baseline immutable, calculate the effects of working changes, expose accessibility consequences, and generate deterministic implementation artifacts.

## Primary Outcome

A user must be able to select any supported semantic color token, map it to an allowed primitive token, see every registered STOBG marketing preview update immediately, inspect the complete resolution chain, identify dependency and accessibility impact, restore official mappings, and export the validated working configuration as JSON and CSS.

## Product Principles

1. **Traceability first:** Every governed rendered color must resolve through component usage -> semantic token -> primitive token -> final color value.
2. **Safe by default:** The official configuration is immutable. All edits occur in working state and can be undone or reset.
3. **Real interfaces over isolated swatches:** Evaluate mappings through realistic STOBG website experiences.
4. **One source of working truth:** Previews, inspection, dependencies, accessibility results, comparison, and export must derive from the same working configuration.
5. **Immediate feedback:** Relevant derived results update in the same transaction as a token change.
6. **Deterministic output:** Identical valid input must generate identical resolved and exported output.
7. **Accessible operation:** The Lab interface itself must support keyboard, screen-reader, zoom, reflow, and non-color status communication.

## Users

### Design System Owner

- Reviews mapping proposals and their effects.
- Preserves the official baseline.
- Uses comparison, validation, snapshots, and export.
- Needs reproducible, trustworthy decisions.

### UX Designer

- Explores alternative semantic mappings.
- Reviews changes across realistic page contexts.
- Needs fast, reversible visual experimentation.

### Front-End Developer

- Traces token relationships.
- Validates dependencies and implementation behavior.
- Needs deterministic data contracts and export artifacts.

### Stakeholder or Reviewer

- Compares official and proposed states.
- Reviews visual and accessibility outcomes with minimal technical knowledge.
- Needs clear language and recognizable status reporting.

## MVP Scope

### Token Types

Primitive groups:

- Neutral
- Cerulean
- Orange
- Teal
- Taupe
- Burgundy

Semantic categories:

- Background
- Text
- Border
- Icon
- Accent
- Action
- Form
- Link

Functional tokens:

- Success
- Danger

Brand tokens:

- Safety 360
- Thrive 360
- Quality 360
- Structure Tone Blue

### Preview Experiences

Implement representative, responsive previews for:

- Homepage: hero, CTA group, statistics, featured projects, insights, leadership, footer
- Markets page: hero, market cards, related content
- Project detail page: hero, statistics, gallery placeholders, callouts
- Careers page: recruitment CTA, benefits cards, application form
- Contact page: form, validation states, success state

All registered preview usages must update from working token state.

### Core Features

- Token browser and filtering
- Official versus working mapping display
- Semantic-to-primitive editing
- Resolved-value display
- Real-time preview updates
- Component inspector
- Token usage overlay
- Dependency analysis
- Official-versus-working comparison
- Accessibility analysis
- Undo and redo
- Reset to official mappings
- Validation summary
- Copy JSON and CSS
- Download JSON and CSS

### Explicit Non-Goals for MVP

- Editing production CSS
- Replacing Figma
- Automatically generating new tokens
- Dark mode
- Automatically approving accessibility exceptions
- Publishing directly to production websites
- Multi-user collaboration unless existing project infrastructure already provides it

## Required User Flows

### Flow 1: Change a Semantic Mapping

1. Open the Lab.
2. Select a semantic token.
3. Display its official mapping, working mapping, resolved primitive, and final value.
4. Display allowed primitive choices.
5. Select a new primitive.
6. Apply one atomic working-state transaction.
7. Recompute resolved tokens, dependency impact, previews, accessibility results, comparison, and export output.
8. Add a reversible history operation.
9. Preserve focus and announce the update to assistive technology.

### Flow 2: Inspect a Component

1. Select or keyboard-activate a registered preview component.
2. Open the inspector without losing the component context.
3. List all governed token usages for the component.
4. For each usage, show the UI property, semantic token, primitive reference, resolved value, and applicable accessibility result.
5. Allow navigation from the usage to the semantic-token editor.

### Flow 3: Review Accessibility

1. Recalculate applicable rules after a relevant mapping change.
2. Group results by pass, warning, and fail.
3. Show component, location, tested token pair, resolved values, measured ratio, and required threshold.
4. Link results back to both the component and token editor.
5. Communicate status using text and iconography in addition to color.
6. Keep automated contrast findings distinct from manual accessibility acceptance criteria.

### Flow 4: Compare and Export

1. List all differences between official and working mappings.
2. Run schema, reference, resolution, and export validation.
3. Separate blocking errors from warnings.
4. Disable clean export while a blocking error exists.
5. Allow accessibility-failure export only through an explicit override with a recorded reason.
6. Generate JSON and CSS from the same validated snapshot of working state.
7. Keep output ordering stable.
8. Support clipboard copy and file download.

### Flow 5: Recover State

- **Undo:** reverse the latest working mapping operation.
- **Redo:** reapply the latest undone operation when no new branch has been created.
- **Reset:** replace working mappings with a fresh copy of official mappings and clear incompatible history.
- Never mutate official state.

## State Management Requirements

Use these conceptual state layers even if the chosen library gives them different names.

### Source State

```ts
export interface LabSourceState {
  officialConfiguration: TokenConfiguration;
  workingConfiguration: TokenConfiguration;
  history: ChangeOperation[];
  future: ChangeOperation[];
}
```

### UI State

```ts
export interface LabUiState {
  selectedTokenId: string | null;
  selectedComponentId: string | null;
  activePreviewId: string;
  tokenFilters: TokenFilters;
  usageOverlayEnabled: boolean;
  comparisonEnabled: boolean;
  inspectorOpen: boolean;
}
```

### Derived State

Do not persist derived state independently unless a measured performance requirement justifies caching. Derive or memoize:

```ts
export interface LabDerivedState {
  resolvedTokens: Record<string, ResolvedToken>;
  dependencyGraph: DependencyGraph;
  affectedComponents: string[];
  accessibilityResults: AccessibilityResult[];
  configurationDiff: ConfigurationDiff;
  validationResult: ValidationResult;
  exportArtifacts: ExportArtifacts | null;
}
```

### State Invariants

- Official state is immutable for the lifetime of the loaded baseline.
- Working state starts as a deep, independent copy of official state.
- One mapping command updates all dependent views atomically.
- Derived values are regenerated whenever their inputs change.
- Reset cannot retain derived data from the abandoned working state.
- A new edit after undo clears the redo stack.
- No component maintains a private token mapping outside canonical state.
- The same working state and schema version produce the same export content.

### Persistence

For MVP, session persistence may use local browser storage only if implemented as a versioned, validated convenience layer. Invalid or incompatible persisted data must never replace the bundled official baseline. Provide a visible action to discard recovered working state. Do not add server persistence unless the repository already contains an approved backend architecture.

## Canonical TypeScript Contracts

Create JSON Schemas that correspond to these TypeScript contracts. Validate token source files at startup and validate export payloads before download.

```ts
export type TokenType = "primitive" | "semantic" | "functional" | "brand";
export type AccessibilityStatus = "pass" | "warning" | "fail" | "not-applicable";
export type ValidationSeverity = "error" | "warning";

export interface PrimitiveToken {
  id: string;
  type: "primitive";
  group: string;
  value: string;
  label: string;
  description?: string;
}

export interface SemanticToken {
  id: string;
  type: "semantic" | "functional" | "brand";
  category: string;
  mapsTo: string;
  label: string;
  description?: string;
  allowedPrimitiveGroups?: string[];
}

export interface TokenConfiguration {
  schemaVersion: string;
  configurationId: string;
  version: string;
  primitives: Record<string, PrimitiveToken>;
  semanticTokens: Record<string, SemanticToken>;
}

export interface TokenUsage {
  id: string;
  semanticTokenId: string;
  property: "background" | "text" | "border" | "icon" | "focus" | "other";
  description?: string;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  previewId: string;
  tokenUsages: TokenUsage[];
}

export interface AccessibilityRule {
  id: string;
  componentId: string;
  label: string;
  foregroundTokenId: string;
  backgroundTokenId: string;
  minimumRatio: number;
  classification: "normal-text" | "large-text" | "ui-component" | "graphic";
}

export interface AccessibilityResult {
  ruleId: string;
  componentId: string;
  foregroundTokenId: string;
  backgroundTokenId: string;
  foregroundValue: string;
  backgroundValue: string;
  ratio: number;
  minimumRatio: number;
  status: AccessibilityStatus;
  message: string;
}

export interface ResolvedToken {
  semanticTokenId: string;
  primitiveTokenId: string;
  value: string;
}

export interface ChangeOperation {
  id: string;
  tokenId: string;
  fromPrimitiveTokenId: string;
  toPrimitiveTokenId: string;
  sequence: number;
  timestamp: string;
}

export interface ValidationIssue {
  code: string;
  severity: ValidationSeverity;
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface ExportManifest {
  schemaVersion: string;
  configurationId: string;
  baselineVersion: string;
  candidateVersion: string;
  generatedAt: string;
  mappings: Record<string, string>;
  validationSummary: {
    errorCount: number;
    warningCount: number;
    accessibilityFailCount: number;
    overrideReason?: string;
  };
}

export interface DependencyGraph {
  bySemanticToken: Record<string, string[]>;
  byComponent: Record<string, string[]>;
}

export interface ConfigurationDiffEntry {
  semanticTokenId: string;
  officialPrimitiveTokenId: string;
  workingPrimitiveTokenId: string;
}

export interface ConfigurationDiff {
  changed: ConfigurationDiffEntry[];
}

export interface ExportArtifacts {
  manifest: ExportManifest;
  json: string;
  css: string;
}

export interface TokenFilters {
  query: string;
  categories: string[];
  changedOnly: boolean;
  accessibilityStatus: AccessibilityStatus | "all";
}
```

## Minimum JSON Schema Behavior

Create schemas for:

- `TokenConfiguration`
- `ComponentDefinition[]`
- `AccessibilityRule[]`
- `ExportManifest`

Schema requirements:

- Reject duplicate IDs during application-level validation.
- Require stable ID, type, label, and required references.
- Restrict token type values to the declared enums.
- Validate primitive color values as supported CSS color values. Prefer a documented canonical format for source data, such as uppercase six-digit hex.
- Reject unknown required-object fields when strict schemas improve safety.
- Include `schemaVersion` in root configuration and export objects.
- Return path-specific, human-readable validation issues.

## Token Resolution Rules

1. Components reference semantic token IDs for governed color properties.
2. Semantic, functional, and brand tokens may reference only allowed primitive tokens in MVP.
3. Primitive tokens resolve directly to final color values and may not reference another token.
4. Resolution order is component usage -> semantic token -> primitive token -> final value.
5. Token IDs are case-sensitive, stable API keys.
6. Display labels are editable content and do not define identity.
7. Reject missing references.
8. Reject circular references, including future-proof validation if additional alias layers are introduced later.
9. Reject duplicate IDs across the namespace rules selected by the implementation.
10. Reject invalid primitive values.
11. Reject references to disallowed primitive groups when a semantic token defines `allowedPrimitiveGroups`.
12. Resolution must not depend on source-object order.
13. Unresolved mappings produce explicit UI errors and block a clean export.
14. Exports use references for mappings and include resolved CSS values through CSS custom-property generation.

## CSS Variable Requirements

Use stable names derived from token IDs.

```css
:root {
  --stobg-primitives-orange-500: #F4A261;
  --stobg-semantic-action-primary: var(--stobg-primitives-orange-500);
}
```

Requirements:

- Primitive variables appear before semantic variables.
- Output order is stable and documented.
- Invalid or unresolved references cannot produce a clean CSS artifact.
- Apply resolved working variables to a scoped Lab preview root so the application shell can retain its own accessible UI tokens.
- Do not let an experimental mapping make the Lab controls themselves unreadable.

## Dependency Registration

Do not discover dependencies by scraping rendered CSS or component source strings. Register component token usage through `ComponentDefinition` data or an equivalent typed registry.

The dependency graph must answer:

- Which components use this semantic token?
- Which semantic tokens does this component use?
- Which previews contain each affected component?
- Which accessibility rules depend on the changed token?

Every governed preview color must have a registered usage. Add a development test that fails when a required preview usage is missing from the registry.

## Accessibility Requirements

Target WCAG 2.2 Level AA for the Lab interface and preview evaluation rules where applicable.

### Automated Contrast Rules

- Normal text: minimum 4.5:1.
- Large text: minimum 3:1 when the rendered text qualifies as large text.
- UI component boundaries, meaningful graphics, and visible focus indicators: minimum 3:1 against adjacent colors where the criterion applies.
- Calculate contrast from resolved colors using a tested utility.
- Round only for display. Compare using the unrounded ratio.
- Every result includes the tested pair, values, ratio, threshold, component, and location.

### Lab Interface Acceptance Criteria

- All interactive controls are keyboard reachable and operable.
- Focus order is logical and visible.
- Focus is preserved after mapping changes and panel updates.
- Dialogs and drawers manage focus correctly and return focus to their trigger.
- Form controls have programmatic labels, instructions, error association, and status messaging.
- Live changes are announced through restrained `aria-live` messaging.
- Pass, warning, and fail use text and iconography in addition to color.
- The primary workflows remain usable at 200% zoom.
- The interface supports reflow without two-dimensional scrolling except where a genuine data visualization requires it.
- Pointer targets meet WCAG 2.2 target-size expectations where applicable.
- Motion respects `prefers-reduced-motion`.
- Automated checks are described as partial evidence and never as complete accessibility certification.

### Export and Accessibility Failures

- Blocking schema and resolution errors disable export.
- Accessibility failures remain visible in the validation summary.
- Export with accessibility failures requires an explicit override interaction and a non-empty reason.
- The override is included in the export manifest.
- Never silently downgrade a failure to a warning.

## Validation Rules

### Blocking Errors

- Missing token reference
- Unresolved token
- Circular reference
- Duplicate ID
- Invalid primitive value
- Invalid schema
- Disallowed token-type reference
- Disallowed primitive-group reference
- Export generation failure

### Warnings

- Accessibility failure or manual-review condition
- Unused semantic token
- Missing recommended description
- Working state has no changes
- Unregistered optional preview coverage

Validation must return all discoverable issues in one pass rather than stopping after the first failure.

## Information Architecture

Use an application shell with these primary regions:

1. **Header:** product name, official baseline version, working status, undo, redo, reset, compare, export.
2. **Token panel:** search, filters, category groups, token rows, official mapping, working mapping, change status.
3. **Preview workspace:** page selector, responsive viewport controls, usage overlay, realistic page preview.
4. **Inspector panel:** selected component, token usages, full resolution chains, dependencies, accessibility results.
5. **Validation area:** grouped errors and warnings with links to affected tokens or components.
6. **Comparison view:** official and working previews plus mapping diff.

The layout must remain usable on common laptop widths and must provide a coherent narrow-width experience.

## Visual Direction

- Professional internal product interface.
- Clear STOBG-aligned use of cerulean, dark blue, orange, teal, taupe, and neutral tones.
- Restraint in the application shell so experimental preview colors remain easy to evaluate.
- Strong hierarchy, generous spacing, and clear selected, changed, warning, and error states.
- Avoid decorative UI that competes with token evaluation.
- Use realistic but locally authored placeholder project and insight content. Do not require remote image services.

## Suggested Technical Stack

Use the existing repository stack when one exists. For a new project, use:

- Vite
- React
- TypeScript with strict mode
- CSS custom properties
- JSON token sources
- A lightweight explicit store or reducer-based architecture
- Vitest
- React Testing Library
- A proven color parsing and contrast utility
- JSON Schema validation

Keep token resolution, dependency generation, validation, accessibility calculation, diffing, and export generation in framework-independent pure modules.

## Proposed Source Structure

```text
src/
  app/
    App.tsx
    app-state.ts
    app-reducer.ts
    selectors.ts
  components/
    shell/
    token-browser/
    preview-workspace/
    inspector/
    accessibility/
    comparison/
    export/
  previews/
    home/
    markets/
    project-detail/
    careers/
    contact/
    registry.ts
  tokens/
    official.tokens.json
    token-types.ts
    resolver.ts
    validator.ts
    css-exporter.ts
    json-exporter.ts
    diff.ts
  accessibility/
    rules.json
    contrast.ts
    evaluator.ts
  schemas/
    token-configuration.schema.json
    component-definitions.schema.json
    accessibility-rules.schema.json
    export-manifest.schema.json
  tests/
    fixtures/
```

Adjust names to match the repository, while preserving separation of pure domain logic from React presentation.

## Testing Requirements

### Unit Tests

Cover:

- Valid resolution
- Missing references
- Invalid token types
- Invalid primitive values
- Circular references
- Allowed primitive-group enforcement
- Dependency graph generation
- Configuration diff generation
- Undo, redo, and reset transitions
- Contrast ratio calculations using known reference cases
- Threshold classification using unrounded values
- Stable JSON ordering
- Stable CSS ordering
- Export manifest validation

### Component and Integration Tests

Cover:

- Changing a token updates every registered affected preview component.
- Inspector displays the complete chain for the selected component.
- Accessibility results update after relevant changes.
- Official state remains unchanged after edit, undo, redo, and reset.
- Validation links move focus to the affected token or component.
- Blocking errors prevent export.
- Accessibility override requires and records a reason.
- Keyboard users can complete the primary flows.

### Manual Acceptance

Verify:

- Responsive layouts
- 200% zoom
- Keyboard-only use
- Screen-reader names, roles, values, instructions, and status updates
- Focus management
- Visible focus
- Color-independent statuses
- Reduced motion
- Downloaded JSON and CSS content
- Side-by-side comparison clarity

## Definition of Done for MVP

The MVP is done only when all of the following are true:

- Supported source files pass schemas and application-level validation.
- Every supported semantic token can map only to an allowed primitive token.
- All registered preview usages update from canonical working state.
- The inspector traces each governed usage to a resolved final value.
- Dependency analysis identifies every registered use of a selected semantic token.
- Accessibility checks recalculate and expose complete result details.
- Undo, redo, and reset restore expected states without mutating official state.
- Official-versus-working comparison accurately lists every changed mapping.
- JSON and CSS exports are deterministic and derived from the visible validated working state.
- Blocking validation errors prevent export.
- Accessibility-failure override is explicit and recorded.
- Keyboard-only operation completes all primary workflows.
- Required automated tests pass.
- The build and lint commands pass.
- There are no known blocking-severity defects in the defined MVP workflows.
- A README explains setup, scripts, architecture, token data, validation, testing, and export behavior.

## Governance Roadmap After MVP

Design the MVP so these can be added without rewriting the token engine:

- Named snapshots
- Snapshot restore
- Mapping diffs between saved configurations
- Baseline and candidate versions
- Change notes and decision status
- Reviewer metadata
- Audit integration for hard-coded color findings
- Additional token families
- Additional STOBG business-unit themes
- More production-aligned component and page previews

Do not implement roadmap features unless they are necessary to support the MVP architecture or already exist in the repository.

## Build Instructions for Copilot

1. Inspect the repository before making changes.
2. Read package scripts, existing architecture, coding conventions, lint rules, and test setup.
3. Reuse existing dependencies and patterns when they satisfy this specification.
4. Do not invent APIs, files, services, brand values, or production integrations that are not present.
5. If the repository is empty, scaffold the suggested Vite, React, and TypeScript application.
6. Create a written implementation plan mapped to the Definition of Done.
7. Implement the domain model and pure functions before complex UI composition.
8. Add representative token data and preview content locally. Clearly identify sample data as sample data.
9. Connect all features to one canonical working configuration.
10. Add tests as each domain capability is implemented.
11. Run available type-check, lint, test, and build commands.
12. Fix failures caused by the implementation.
13. Report commands actually run and their actual results. Do not claim testing or validation that was not performed.
14. Document assumptions, deviations, known limitations, and remaining manual checks.
15. Return complete changed files or apply changes directly through the coding-agent environment. Avoid fragmented snippets.

## Required Final Report

When implementation is complete, report:

- Architecture created or reused
- Files added, changed, and removed
- Token and component data included
- User flows implemented
- Accessibility behavior implemented
- Validation and export behavior implemented
- Tests added
- Commands run and actual results
- Assumptions and limitations
- Definition of Done items satisfied
- Definition of Done items still open

Never represent an unexecuted test, inaccessible environment, or incomplete feature as verified.
