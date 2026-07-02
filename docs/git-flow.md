# Git Flow

## Goal

Use a single, predictable Git flow across all Foundry repositories.

## Rules

- `main` is the protected release branch.
- All work starts in a short-lived branch created from the current integration branch.
- Branch names must be in English and use kebab-case.
- Commit messages must follow Conventional Commits.
- Merge only through pull requests.
- Do not push directly to protected branches.
- Each commit must contain one logical change or a tightly related set of changes.
- Split large work into sequential commits that each stay focused on a single responsibility.
- Do not mix unrelated concerns in the same commit.

## Default Flow

The standard flow after the initial release is:

```text
feature or fix branch -> dev -> stage -> main
```

## Pre-Release Exception

Before the first production release:

- work can happen from `main` only if the repository has not introduced `dev` and `stage` yet
- direct pushes are still not allowed
- once the first release ships, create `dev` and `stage` from `main`
- after that, all feature work must branch from `dev`

## Branch Types

- `feat` for new behavior.
- `fix` for bug fixes.
- `refactor` for structural changes without behavior changes.
- `docs` for documentation-only work.
- `test` for test-only work.
- `chore` for maintenance work.

## Practical Rules

- Keep branch names specific.
- Keep commits atomic and easy to review.
- Use pull requests to move work between branches.
- Promote changes in the order `dev`, then `stage`, then `main`.
