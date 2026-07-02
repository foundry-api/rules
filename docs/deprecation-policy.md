# Deprecation Policy

## Goal

Deprecated code must remain explicit, documented, and temporary.

## Rules

- Never leave unused code silently in the repository.
- If a symbol, file, or path is no longer used, remove it unless it is still required for compatibility.
- If compatibility is still required, mark the item as deprecated.
- Deprecated symbols must include a `@deprecated` JSDoc tag.
- The deprecation note should explain the replacement or migration path.
- If a rule changes, prefer deprecating the old rule document or section and replacing it with a new one when downstream teams still need the migration path.
- Remove the old rule only after the replacement is in place and the legacy wording is no longer needed.
- Deprecated code must not be used for new work unless it is part of a deliberate migration.
- Deprecated compatibility code should remain covered by tests when it still executes.
- Remove deprecated items once they are no longer needed.

## Example

If a controller helper is replaced by a newer API, keep the old helper only long enough to migrate consumers and mark it as deprecated with the new replacement.
