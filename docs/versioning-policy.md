# Versioning Policy

## Goal

Use one deterministic versioning scheme across Foundry Api repositories so releases, changelogs, and downstream synchronization stay aligned.

## Rules

- Use Semantic Versioning in the form `MAJOR.MINOR.PATCH`.
- Increment `MAJOR` for breaking changes that require consumer action.
- Increment `MINOR` for backward-compatible feature additions.
- Increment `PATCH` for backward-compatible bug fixes, maintenance updates, and documentation-only release work.
- Use prerelease identifiers only when a release candidate is needed, and format them as `-rc.N`.
- Release candidate versions must keep the same base version as the upcoming stable release.
- The published package version and the release tag version must match exactly.
- Release tags must use the `rules-vX.Y.Z` pattern for stable releases.
- Pre-release tags must use the `rules-vX.Y.Z-rc.N` pattern.
- Do not invent alternative version formats such as calendar versions or build metadata unless the policy is explicitly updated.
- Downstream synchronization must only consume stable versioned releases, not prerelease builds.

## Examples

- `0.1.0` for the first stable public release.
- `0.2.0-rc.1` for the first release candidate of an upcoming minor release.
- `1.0.0` for the first stable breaking release.
