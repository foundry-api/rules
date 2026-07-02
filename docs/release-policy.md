# Release Policy

## Goal

Release versions are the only approved mechanism for publishing Foundry Api rules to downstream repositories.

## Rules

- `@foundry-api/rules` must be versioned using semantic versioning.
- Version selection must follow `docs/versioning-policy.md`.
- Package versions must use `X.Y.Z` and may use prerelease suffixes such as `-rc.1` when needed.
- Git tags and GitHub releases must use the `rules-vX.Y.Z` format.
- The release title should match the tag name for clarity.
- A release cannot happen until `CHANGELOG.md` contains the changes to be released and the target version.
- A downstream synchronization run may happen only after a new version is published.
- The synchronization workflow must use the release published from `main` as its source of truth.
- Draft changes, feature branches, and untagged commits must not trigger downstream synchronization.
- The published release must include the rule documents, generated `AGENTS.md` files, and repository-local skill copies.
- The published release must include the rule documents, generated `AGENTS.md` files, `CONTRIBUTING.md`, and repository-local skill copies.
- Any sync failure after release must be treated as a release issue and fixed before the next downstream update.

## Recommended Release Shape

1. Merge rule changes into `main`.
2. Bump the package version.
3. Update `CHANGELOG.md` with the release version and the latest changes.
4. Create a release tag in the form `rules-vX.Y.Z`.
5. Publish the versioned package and release notes.
6. Trigger the synchronization workflow from that release.
7. Update downstream repositories from the published version only.
