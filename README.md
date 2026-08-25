# Design Token Lab

A local-first tool for exploring semantic color mappings before production use.

## Start

```bash
npm install
npm run dev
```

## Current slice

- Vite, React, and strict TypeScript foundation.
- Canonical official and independent working token configurations.
- Typed primitive and semantic token contracts.
- Registered preview component usage data.
- Pure token resolution and official-versus-working diff functions.
- Responsive lab shell with token browser, live homepage preview, and component inspector.
- Working mapping changes with undo, redo, reset, live status messaging, and JSON download.
- Configuration validation with blocking reference/color/group errors and warnings.
- WCAG contrast ratio utility and deterministic primitive-first JSON/CSS export.
- Registered accessibility rules evaluated against the current working resolution, with measured ratios and pass/fail status in the inspector.
- Changed-token filtering and an official-versus-working comparison drawer.
- Validation drawer with blocking issue summary and explicit accessibility override reasons recorded in export metadata.
- Versioned browser-local recovery with a visible discard action, plus JSON/CSS clipboard copy.
- Draft 2020-12 JSON Schemas for token configuration, component definitions, accessibility rules, and export manifests.
- Runtime Ajv 2020 schema validation with path-specific failures for malformed source or recovered data.
- Deterministic dependency graph for semantic-token-to-component relationships.
- Functional local previews for Homepage, Markets, Project Detail, Careers, and Contact.
- Generic product surface with no organization-specific branding in the UI or generated artifacts.
- JSON token upload that validates the configuration and requires the semantic IDs used by the built-in preview registry before replacing the baseline.
- Page-specific registered components for Markets, Project Detail, and Careers, plus selected-token dependency impact in the lab shell.
- Page-specific automated accessibility rules and export manifests carrying actual validation and contrast-failure counts.
- Focused Vitest coverage for resolution, validation, contrast, diffs, and export ordering.

The included token and preview content is representative sample data for the prototype. The official baseline is never mutated by working-state changes. Uploaded configurations must use the supported token contract and include the semantic IDs used by the built-in preview registry.
The local Word reference documents are intentionally ignored by Git and remain workspace-only source material.

## Scripts

- `npm run dev` starts the development server.
- `npm run build` runs TypeScript checks and creates a production bundle.
- `npm run lint` runs Oxlint.

## Next implementation slice

Broaden component/integration coverage and perform the final manual accessibility pass.
