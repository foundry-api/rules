# Architecture Policy

## Goal

Foundry Api must stay framework-agnostic at the core and technology-specific at the edges.

## Rules

- Follow SOLID.
- Prefer composition over heavy inheritance.
- Give every mixin a single responsibility.
- Keep the core independent from HTTP frameworks, ORMs, databases, loggers, and documentation providers.
- Keep one concern per file whenever the module has enough complexity to justify it.
- Treat `@foundry-api/contracts` as the source of truth for shared abstractions.

## Example

If a module handles routing, response formatting, and logging, split it into separate units instead of keeping everything in one file.
