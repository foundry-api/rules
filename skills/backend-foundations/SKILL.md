---
name: backend-foundations
description: General backend engineering rules for TypeScript services, APIs, repositories, and adapters. Use this local repo copy when working in Foundry repositories to apply architecture, documentation, quality, testing, and deprecation guidance that is not project-specific.
---

# Backend Foundations

Use this skill for backend work in TypeScript services, APIs, libraries, and adapters.

## Core rules

- Follow SOLID.
- Prefer composition over heavy inheritance.
- Give each module, function, class, or mixin a single responsibility.
- Keep the codebase in TypeScript and avoid `any` unless there is no practical alternative.
- Keep code, comments, docs, and tests in English.
- Do not leave dead code in place; remove it or mark it deprecated when compatibility requires it.
- Use explicit deprecation with `@deprecated` and a migration path.
- Split logic, types, constants, and templates into separate files when the module complexity justifies it.
- Prefer one concern per file and use folder-based modules when a feature grows.
- Add tests for every new behavior.
- Keep linting and formatting mandatory.
- Treat repository-specific instructions as higher priority than this skill when they exist.

## JSDoc guidance

- Document exported symbols and non-trivial internal logic.
- Explain intent, behavior, inputs, outputs, edge cases, and side effects.
- Include examples for public APIs and complex helpers.
- Use tags such as `@name`, `@method`, `@description`, `@param`, `@returns`, `@throws`, `@example`, `@remarks`, and `@template` as needed.

## Testing guidance

- Add unit or integration tests for every new feature.
- Prefer tests that protect behavior rather than implementation details.
- Keep tests readable and deterministic.
- Maintain high coverage for backend code.

## Quality gates

- ESLint is mandatory.
- Prettier is mandatory.
- If a repo defines commit or push hooks, follow them.
- Do not merge code that fails tests or quality gates.
