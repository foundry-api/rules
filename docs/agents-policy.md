# AGENTS Policy

## Goal

Every Foundry repository must have a generated `AGENTS.md` that clearly separates generated content, local repository scope, and synchronized global rules.

## Rules

- `AGENTS.md` files are generated from the central rules repository.
- The generated header must identify the source repository and the last sync time in UTC.
- The generated header must warn that synced sections are overwritten.
- Every repo must vendor the synchronized `skills/backend-foundations/SKILL.md` copy.
- `AGENTS.md` must instruct contributors to read the local backend-foundations skill before editing code.
- Each repo must keep a local section that explains the repo's purpose and responsibilities.
- Global rules come from `@foundry-api/rules` and must be copied into every repo.
- The canonical template lives at `templates/AGENTS.md` in this repository.
- Do not edit synced sections manually.
- Update the central rules repository first when changing shared guidance.
- Keep repository-specific responsibilities in the local section only.

## Required AGENTS structure

1. Generated header
2. Local scope, including the local skill instruction
3. Synced global rules

## Example

```md
<!-- AUTO-GENERATED FROM: /Users/raymundo.salazar/Documents/_WORK/_FOUNDRY/rules -->
<!-- GENERATED_AT_UTC: 2026-07-01T16:12:23Z -->
<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->
```
