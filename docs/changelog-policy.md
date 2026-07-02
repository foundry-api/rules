# Changelog Policy

## Goal

Every repository change must be recorded in the changelog before it can be released.

## Rules

- Every meaningful change must have an entry in `CHANGELOG.md`.
- The changelog must include an `Unreleased` section for in-progress work.
- The changelog must list the version that is about to be released before the release is published.
- A release is not allowed unless the changelog already contains the latest changes and the target version.
- The changelog entry must be updated in the same branch or pull request as the code or policy change it describes.
- If a repository does not have a changelog yet, the synchronization workflow may bootstrap one with an `Unreleased` section.
- Release notes should be derived from the changelog rather than written independently when possible.
- Remove stale unreleased notes after they are promoted into a versioned release section.

## Recommended Structure

1. `Unreleased`
2. The next version to be released, for example `0.2.0`
3. Older released versions in descending order

## Example

```md
## Unreleased

- Add changelog policy.

## 0.2.0

- Release sync API with repository-level script generation.
```
