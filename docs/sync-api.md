# Synchronization API

## Goal

Describe the programmatic helper exposed by `@foundry-api/rules` for updating downstream repositories.

## Intended Shape

The package exposes two synchronization entry points:

- `syncRulesToRepository`
- `syncRulesToWorkspace`

They can:

- read the published rules version
- render docs and generated repository files
- write the output to a target repository
- be called from a script, a CI job, or another package

## Responsibilities

- The API should handle generation and file writing only.
- Git operations should stay outside the core generator unless explicitly required.
- Repo-specific writes should remain scoped to the target repository.
- The helper should be composable so future sync strategies can reuse the same renderer.
- When a target repository is updated, the API should create a `sync:rules` script in `package.json` if it is missing.
- The generated `sync:rules` script should call a local helper file under `scripts/`.

## Expected Inputs

- the published rules version or local package instance
- the target repository path
- the list of generated assets to write
- optional metadata such as generated timestamp and source path
- for workspace sync, an explicit list of target repository paths

## Expected Outputs

- updated documentation files
- updated `AGENTS.md`
- updated skill copies
- an ensured `sync:rules` script in `package.json`
- an optional repository-local sync helper file under `scripts/`
- a report describing what changed

## Notes

- This document defines the intended contract first.
- The implementation can be added later without changing the policy shape.
- A downstream consumer can import the package and call the sync function from a script or GitHub Action.
