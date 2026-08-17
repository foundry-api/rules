# Contributing

## Goal

This document explains how to contribute to Foundry API repositories in a predictable and maintainable way.

## Ways To Contribute

### Issues

- Use issues to report bugs, request features, or document unclear behavior.
- Describe the problem clearly and include reproduction steps when applicable.
- Add expected behavior, actual behavior, and any relevant logs or screenshots.
- Keep one issue focused on one problem.

### Code Contributions

- Pick an issue or feature scope before writing code.
- Create a short-lived branch that follows the repository Git flow.
- Keep each commit atomic and limited to one logical change or a tightly related set of changes.
- Use Conventional Commits for commit messages.
- Update tests for every new behavior or bug fix.
- Update `CHANGELOG.md` in the same branch or pull request as the change.
- Run lint, format, typecheck, and tests before opening or updating a pull request.

### Financial Support

- If you want to support the project financially, use the project's donation or Buy Me a Coffee link when it is available.
- If no public support link exists yet, open an issue or discussion asking the maintainers to publish one.

## Pull Request Expectations

- Keep pull requests focused and easy to review.
- Reference the related issue when one exists.
- Explain what changed, why it changed, and how it was validated.
- Do not combine unrelated fixes in the same pull request.

## Example Contribution Flow

1. Open or select an issue.
2. Create a branch for the work.
3. Implement the change in small commits.
4. Add or update tests.
5. Update `CHANGELOG.md`.
6. Run linting, formatting, and tests.
7. Open the pull request.
