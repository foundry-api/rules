# Code Quality Policy

## Goal

Every change must be formatted and linted consistently.

## Rules

- ESLint is mandatory.
- Prettier is mandatory.
- No change should be committed if ESLint fails.
- No change should be committed if Prettier fails.
- Use Husky as the `pre-commit` gate.
- Keep the codebase in English.

## Example

If a file fails formatting, fix it before committing instead of relying on manual review.
