<!-- AUTO-GENERATED FROM: /Users/raymundo.salazar/Documents/_WORK/_FOUNDRY/rules -->
<!-- GENERATED_AT_UTC: 2026-07-02T02:59:47Z -->
<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->

# AGENTS

Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.

## Local Scope

- Describe the repository's purpose and ownership here.
- Keep repo-specific guidance local to this section.
- Keep the synchronized skill copy in `skills/backend-foundations/SKILL.md`.

## Synced Global Rules

### Purpose

`@foundry-api/rules` is the canonical source of truth for Foundry Api policies. It defines the repository-wide rules that must be replicated into every Foundry repository.

### Read First

Before making changes, read in this order:

1. `README.md`
2. `CONTRIBUTING.md`
3. `skills/backend-foundations/SKILL.md`
4. `docs/architecture.md`
5. `docs/jsdoc-policy.md`
6. `docs/code-quality.md`
7. `docs/testing-policy.md`
8. `docs/naming-standard.md`
9. `docs/deprecation-policy.md`
10. `docs/changelog-policy.md`
11. `docs/versioning-policy.md`
12. `docs/release-policy.md`
13. `docs/git-flow.md`
14. `docs/synchronization-policy.md`
15. `docs/synchronization-workflow.md`
16. `docs/sync-api.md`
17. `docs/agents-policy.md`
18. `package.json`

### Repository Shape

- This repo contains policies only.
- Keep all rule content in `docs/`.
- Keep the README as the index and summary.
- Keep `package.json` publishable and minimal.
- Do not add application code, adapters, or runtime logic here.

### What This Repo Controls

- Architecture rules.
- JSDoc policy.
- Code quality policy.
- Testing policy.
- Naming standard.
- Deprecation policy.
- Synchronization policy.
- AGENTS generation policy.

### Non-Negotiable Rules

- Use English for code, docs, comments, tests, and filenames where practical.
- Follow SOLID.
- Prefer composition over inheritance.
- Keep one concern per file when the content grows.
- Do not allow dead code to remain silently in the repo.
- Mark compatibility-only code as deprecated with `@deprecated`.
- ESLint and Prettier are mandatory in downstream repositories.
- Tests and coverage gates are mandatory in downstream repositories.

### Editing Rules

- Keep policy text concise, explicit, and actionable.
- Update the README index when adding or removing a policy document.
- If a rule changes here, downstream repositories must be synchronized.
- Do not use cross-repo relative links.
- Preserve the canonical meaning of terms such as `group`, `name`, `id`, and `provider`.

### When To Be Careful

- If a policy change affects every repo, review the downstream impact first.
- If a change introduces ambiguity, rewrite the policy until it is operationally clear.
- If the change needs automation, update the synchronization policy as part of the same work.
