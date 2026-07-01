# JSDoc Policy

## Goal

JSDoc should explain intent, behavior, inputs, outputs, and edge cases without forcing a reader to inspect the implementation.

## Rules

- Document every exported class, function, method, type, interface, and exported constant.
- Document complex internal logic when the code is not self-explanatory.
- Keep trivial private locals undocumented when JSDoc would only add noise.
- Write documentation in English.
- Prefer intent over restating the name of the symbol.
- Include at least one example when the symbol is part of the public API or has non-trivial behavior.

## Recommended tags

- `@name`
- `@method`
- `@description`
- `@param`
- `@returns`
- `@throws`
- `@example`
- `@remarks`
- `@template`

## Example

Document a function that transforms raw ORM records into a repository-safe format, including what it returns and when it throws.
