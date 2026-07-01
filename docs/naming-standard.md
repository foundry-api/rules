# Naming Standard

## Goal

Package names and runtime identifiers must make the provider family and implementation obvious.

## Rules

- `group` identifies the provider family.
- `name` identifies the concrete implementation.
- `id` must use the `group:name` format.
- npm packages must use `@foundry-api/provider-<group>-<name>`.
- Avoid ambiguous names that could be confused across groups.

## Example

- `server:express` -> `@foundry-api/provider-server-express`
- `orm:sequelize` -> `@foundry-api/provider-orm-sequelize`
