# Testing Policy

## Goal

Every new behavior must be covered by tests and protected by the repository pipeline.

## Rules

- Add a unit test or integration test for every new feature.
- Tests run automatically in the repository during push validation.
- Do not merge if tests fail.
- Do not merge if coverage is below 90%.
- Keep test names and assertions in English.

## Example

If you add a new provider adapter, add tests for its happy path and its main failure path.
