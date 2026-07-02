# Synchronization Workflow

## Goal

Define how `@foundry-api/rules` propagates documentation, `AGENTS.md`, and skill copies to downstream repositories.

## Rules

- Synchronization is owned by the `rules` repository.
- Synchronization must target only repositories that consume Foundry rules.
- Synchronization runs only after a versioned release is published.
- Synchronization must copy:
  - rule documents in `docs/`
  - repository `README.md` rule indexes
  - generated `AGENTS.md`
  - repository-local skill copies under `skills/backend-foundations/`
- Synchronization must not copy Git history or unrelated application code.
- Synchronization must preserve repository-specific local sections in `AGENTS.md`.
- Synchronization must write timestamps in UTC.

## Workflow Shape

1. Publish a new `@foundry-api/rules` release from `main`.
2. Start the synchronization workflow from that release.
3. Read the canonical rule set from the published version.
4. Render the downstream files from the templates.
5. Open or update one pull request per downstream repository.
6. Require review before merging the downstream changes.

## Failure Handling

- If one repository fails, the workflow must report the failing target explicitly.
- Partial success must not be hidden.
- The canonical release stays unchanged; only the downstream sync is retried.

## Safety

- The workflow must be disabled by default until the release pipeline is fully approved.
- No automatic write to downstream repositories should happen from an unreviewed local branch.
