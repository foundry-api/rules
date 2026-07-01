# Synchronization Policy

## Goal

Keep the rules repository as the single source of truth while ensuring downstream repositories stay aligned.

## Rules

- This repository owns the canonical version of the rules.
- Downstream repositories must copy or sync the rules from this repository.
- Rule changes should be propagated through an automated workflow.
- Prefer pull requests over direct commits when syncing downstream repositories.
- Keep repository-specific README notes local, but keep the rule set itself consistent.
- Do not use cross-repo relative links as a synchronization mechanism.

## Example

When `jsdoc-policy.md` changes here, a sync workflow should update the corresponding file in every Foundry repository and open a PR if manual review is required.
