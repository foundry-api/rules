# @foundry-api/rules

Central source of truth for Foundry Api rules and policies.

## Rules

- [Architecture](./docs/architecture.md)
- [JSDoc Policy](./docs/jsdoc-policy.md)
- [Code Quality](./docs/code-quality.md)
- [Testing Policy](./docs/testing-policy.md)
- [Naming Standard](./docs/naming-standard.md)
- [Deprecation Policy](./docs/deprecation-policy.md)
- [Changelog Policy](./docs/changelog-policy.md)
- [Synchronization Policy](./docs/synchronization-policy.md)
- [Versioning Policy](./docs/versioning-policy.md)
- [Release Policy](./docs/release-policy.md)
- [Git Flow](./docs/git-flow.md)
- [Synchronization Workflow](./docs/synchronization-workflow.md)
- [Synchronization API](./docs/sync-api.md)
- [AGENTS Policy](./docs/agents-policy.md)

## Roadmap

- [Foundry Api MVP Roadmap](./docs/mvp-roadmap.md)
- [Foundry Api MVP REST CRUD Spec](./docs/mvp-rest-crud-spec.md)

## Contributing

- [Contributing Guide](./CONTRIBUTING.md)

## Skills

- [Backend Foundations](./skills/backend-foundations/SKILL.md)

## Purpose

This repository defines the official documentation and policy set that must be replicated across every Foundry Api repository.

## Distribution

The content in this repository is intended to be synchronized into the individual Foundry repositories that live under `_FOUNDRY`.

## Usage

Treat this repository as the source of truth. When a rule changes here, the downstream repositories must be updated through the synchronization workflow.

## Synchronization API

The package exposes a programmatic sync entry point that downstream repositories can consume as a dependency.

```ts
import { syncRulesToRepository } from "@foundry-api/rules";
```

Use `syncRulesToRepository` for one repository or `syncRulesToWorkspace` for a batch of repositories.
