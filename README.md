# Design Token Lab

A local-first tool for exploring semantic color mappings before production use.

It runs entirely in the browser. No token files or working changes are sent to a server.

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
- Bundled primitive scales across Neutral, Cerulean, Orange, Teal, Taupe, and Burgundy, with semantic allowed-group filtering retained.
- Page-specific registered components for Markets, Project Detail, and Careers, plus selected-token dependency impact in the lab shell.
- Page-specific automated accessibility rules and export manifests carrying actual validation and contrast-failure counts.
- Focused Vitest coverage for resolution, validation, contrast, diffs, and export ordering.

The included token and preview content is representative sample data for the prototype. The official baseline is never mutated by working-state changes. Uploaded configurations must use the supported token contract and include the semantic IDs used by the built-in preview registry.
The local Word reference documents are intentionally ignored by Git and remain workspace-only source material.

## Uploading Tokens

Use **Upload tokens** in the header to load a JSON configuration. A valid upload must contain:

- `schemaVersion`, `configurationId`, and `version`
- A `primitives` object containing uppercase six-digit hex values such as `#0067A5`
- A `semanticTokens` object where each token maps to an existing primitive
- These preview-compatible semantic IDs: `accent-brand`, `action-primary`, `background-subtle`, `background-canvas`, `text-primary`, and `text-on-brand`

See [examples/tokens.example.json](examples/tokens.example.json) for a complete starter file. Display labels and descriptions can be changed; IDs are the stable references used by previews and rules.

An accepted upload becomes the new immutable baseline. The working state starts as a separate copy, so edits, undo, redo, reset, comparison, validation, and exports operate on the uploaded configuration. Invalid files are rejected without replacing the current state.

## Exporting

JSON and CSS exports are generated from the same validated working snapshot. CSS uses deterministic `--token-lab-*` custom property names with primitive variables before semantic variables. Exports are blocked by schema, reference, color, or allowed-group errors. Accessibility failures require a written override reason, which is recorded in the manifest.

Clipboard actions require browser clipboard permission and a secure context in some browsers. File downloads do not require clipboard access.

## Architecture

- `src/tokens`: contracts, schemas, validation, resolution, dependencies, diffs, and export generation.
- `src/accessibility`: contrast calculation, registered rules, and evaluation.
- `src/previews`: locally authored preview experiences and their inspector callbacks.
- `src/App.tsx`: canonical working state, history, persistence, and shell composition.

The bundled sample configuration is used as the fallback baseline. Browser recovery is versioned in local storage and can be discarded from the visible recovery banner.

## Status

| Area | Status |
| --- | --- |
| Token editing, resolution, history, comparison | Implemented |
| JSON upload and runtime schema validation | Implemented |
| Homepage, Markets, Project Detail, Careers, Contact previews | Implemented |
| Accessibility contrast rules and export override | Implemented |
| Deterministic JSON/CSS export | Implemented |
| Component and integration test breadth | In progress |
| Manual keyboard, screen-reader, zoom, reflow, and reduced-motion review | Required |

The automated accessibility checks are partial evidence, not accessibility certification.

## Scripts

- `npm run dev` starts the development server.
- `npm run build` runs TypeScript checks and creates a production bundle.
- `npm run lint` runs Oxlint.

