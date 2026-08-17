---
name: backend-foundations
description: Use this skill for Foundry backend repositories when you need architecture, documentation, quality, testing, or deprecation guidance for TypeScript services, APIs, libraries, and adapters.
metadata:
  author: Raymundo Salazar <hello@raymundosalazar.dev>
  author_url: https://github.com/raymundo-salazar
  homepage: https://raymundosalazar.dev
---

# Backend Foundations

Use this skill when working in Foundry backend repositories and the task involves one of the following:

- architecture or module boundaries
- JSDoc or public API documentation
- code quality, linting, or formatting
- testing strategy or coverage
- deprecation and migration guidance

Follow repository-specific instructions first when they exist. Treat this skill as the default backend baseline, not as a replacement for local repo policy.

## Core Principles

- Follow SOLID.
- Prefer composition over heavy inheritance.
- Give each module, function, class, or mixin a single responsibility.
- Keep the codebase in TypeScript and avoid `any` unless there is no practical alternative.
- Keep code, comments, docs, and tests in English.
- Remove dead code instead of leaving it silently in place.
- Use `@deprecated` for compatibility-only code and include a migration path.
- Split logic, types, constants, and templates into separate files when complexity grows.
- Prefer one concern per file and folder-based modules for larger features.

## Documentation Rules

- Document exported symbols and non-trivial internal logic.
- Explain intent, behavior, inputs, outputs, edge cases, and side effects.
- Include examples for public APIs and complex helpers.
- Use JSDoc tags such as `@name`, `@method`, `@description`, `@param`, `@returns`, `@throws`, `@example`, `@remarks`, and `@template` as needed.
- Keep documentation specific enough that a reader can use the symbol without inspecting the implementation.

## Testing Rules

- Add unit or integration tests for every new behavior.
- Prefer tests that protect behavior rather than implementation details.
- Keep tests readable and deterministic.
- Cover failure paths when they matter to the contract.
- Maintain high coverage for backend code.

## Quality Gates

- ESLint is mandatory.
- Prettier is mandatory.
- Follow commit or push hooks defined by the repository.
- Do not merge code that fails tests or quality gates.

## Security Rules

- Do not hardcode secrets, API keys, passwords, or tokens.
- Treat scripts as code and review them before enabling or executing them.
- Prefer explicit MCP or adapter integrations for external services instead of ad hoc shell access.
- Review any downloaded or copied skill content before enabling it in a repository.

## Practical Checklist

1. Read the repository instructions and identify the local source of truth.
2. Decide the smallest change that solves the problem.
3. Keep the implementation focused on one workflow or one responsibility.
4. Add or update tests for the behavior you changed.
5. Verify linting, formatting, and type checking before finishing.

## Example Usage

- Updating a service boundary: split transport, validation, and persistence concerns into separate modules.
- Adding a public helper: document it with JSDoc, add examples, and cover the success and failure paths.
- Removing legacy code: mark compatibility-only code as `@deprecated` first, then remove it once consumers are migrated.
