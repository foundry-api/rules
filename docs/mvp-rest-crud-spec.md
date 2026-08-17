# Foundry API MVP REST CRUD Spec

## Goal

Define the initial REST API behavior that Foundry API must generate for the MVP launch.

The product must expose a usable REST CRUD API with:

- a single application entry point
- automatic controller-driven route generation
- optional manual/custom routes
- OpenAPI generation
- file-based logging
- Express as the server provider
- Sequelize as the ORM provider

## Application Entry Point

The consumer application must start from one explicit server entry point.

That entry point is responsible for:

- bootstrapping the server
- registering global middlewares
- configuring request lifecycle rules
- registering providers
- attaching controllers
- initializing documentation output
- initializing logging

The application entry point must remain framework-oriented, not model-oriented.

## Controller Contract

The controller is the main unit of product configuration.

Each controller must be able to declare:

- the resource base path
- the resource entity name
- the model or repository to use
- the create schema
- the update schema
- optional custom routes
- optional OpenAPI overrides
- optional hooks

### Controller With Model

When a controller defines a model, Foundry API must be able to generate a full CRUD surface automatically.

If the base path is omitted, the framework must derive it by pluralizing the entity or model name.

If the controller has no model:

- automatic CRUD generation must not occur
- the controller can still expose custom routes
- the framework must require an explicit base path if routes are being registered

### Controller Hooks

The controller must support hooks that allow developers to extend behavior without rewriting the framework flow.

Typical hook points include:

- before create
- after create
- before update
- after update
- before delete
- after delete
- before restore
- after restore
- before list
- after list

Hooks must be opt-in and must not force the user to reimplement the default CRUD path.

## Canonical REST Endpoints

The MVP must generate the following endpoints when the controller has a model and automatic CRUD is enabled.

### `GET /users`

List resources with pagination, filtering, ordering, field selection, and relational expansion.

#### Query Parameters

- `search[columnName]=value`
- `order[columnName]=asc|desc`
- `include=roles,roles.permissions`
- `fields=columnName1,columnName2,include1.columnName1`
- `limit=200`
- `page=2`

#### Behavior

- `search` must support partial matching semantics with `%` as a wildcard token.
- Examples:
  - `Alberto%` matches values that start with `Alberto`
  - `%erto` matches values that end with `erto`
  - `%ber%` matches values that contain `ber`
- `order` must support column-level ordering.
- `include` must support nested relations with dot notation.
- `fields` must support nested field selection with dot notation.
- `limit` must have a maximum value of `500`.
- `page` must be 1-based unless a different pagination policy is formally defined elsewhere.

### `GET /users/:id`

Fetch a single resource by id.

#### Allowed Query Parameters

- `order`
- `include`
- `fields`

#### Disallowed Query Parameters

- `search`
- `limit`
- `page`

### `POST /users`

Create a new resource.

#### Behavior

- The request body must be validated against the create schema before persistence.
- The endpoint itself must remain thin and delegate validation and persistence to the controller flow.
- If validation fails, the request must fail before any persistence side effect occurs.

### `PUT /users/:id`

Replace or update an existing resource.

### `PATCH /users/:id`

Partially update an existing resource.

#### Behavior for PUT and PATCH

- Both endpoints must support the update schema.
- The framework may allow separate validation policies for full and partial updates.
- Update behavior must remain compatible with the chosen ORM provider.

### `DELETE /users/:id`

Delete a resource.

#### Behavior

- If the model supports logical deletion, perform a logical delete.
- If the model does not support logical deletion, perform a physical delete.
- The deletion strategy must be explicit and deterministic.

### `GET /users/trash`

List logically deleted resources.

#### Behavior

- This endpoint must only exist when the model supports logical deletion.
- The endpoint must follow the same general listing semantics as `GET /users`, except that it operates on deleted records.

### `POST /users/:id/restore`

Restore a logically deleted resource.

#### Behavior

- This endpoint must only exist when the model supports logical deletion.
- Restoration must be a first-class operation, not a custom workaround.

## Pagination Rules

- `limit` defaults should be defined by the controller or framework policy.
- `limit` must never exceed `500`.
- `page` and `limit` must be validated before query execution.
- Pagination metadata should be included in the response when available.

## Filtering Rules

- Filtering must support column-specific query syntax.
- Search semantics must support partial matching through `%`.
- The implementation must allow provider-specific translation while keeping the public contract stable.

## Relation Rules

- Relations must be loadable from the query surface.
- Nested relations must be supported.
- Relation loading must remain compatible with the ORM provider.
- Relation metadata must be exposed to OpenAPI generation.

## Field Selection Rules

- Response field selection must be opt-in.
- Nested field selection must be supported.
- Field selection must be preserved in the public contract so it can be documented and tested.

## OpenAPI Rules

The framework must generate OpenAPI documentation automatically for the canonical CRUD endpoints.

The generated documentation must include:

- endpoint descriptions
- request body schemas
- query parameter schemas
- response schemas
- pagination information
- relation hints
- default error responses

### OpenAPI Overrides

The controller must allow developers to override or extend:

- operation descriptions
- tags
- parameter definitions
- response definitions
- schema definitions
- custom endpoint metadata

The framework-generated OpenAPI must act as the default layer, not as a hard limit.

## Custom Controller Behavior

Controllers without a model must still be valid.

Those controllers may:

- define manual routes
- define custom request handling
- define custom OpenAPI metadata
- use hooks and shared infrastructure

Those controllers must not get automatic CRUD endpoints unless a model is present.

## MVP Acceptance Criteria

The MVP is complete when:

- a developer can define one application entry point
- a developer can define one controller with a model, base path, create schema, and update schema
- Foundry API generates the CRUD endpoints automatically
- the generated endpoints support pagination, search, ordering, inclusion, and field selection
- soft delete behavior works when supported by the model
- OpenAPI is generated automatically
- custom controller metadata can extend the generated documentation
- file logging can be plugged into the application
- the result is usable as a real REST CRUD API without manual wiring of each endpoint
