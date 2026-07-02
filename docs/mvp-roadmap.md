# Foundry Api MVP Roadmap

## Goal

Deliver a minimal but production-oriented Foundry Api stack that lets a developer create a CRUD API with Express, Sequelize, OpenAPI, and file logging in a small number of lines.

## Current State

- [x] Define the MVP roadmap and the REST CRUD specification. Completed at UTC 2026-07-02T17:04:52Z.
- [x] Expose the roadmap and spec from the `rules` README. Completed at UTC 2026-07-02T17:04:52Z.
- [x] Add canonical CRUD query constants and controller metadata primitives to `@foundry-api/contracts`. Completed at UTC 2026-07-02T17:11:46Z.
- [x] Align the `core` base controller with the MVP base path and model contract. Completed at UTC 2026-07-02T17:16:29Z.
- [ ] Lock the canonical contract model for the MVP.
- [ ] Implement the MVP runtime stack.
- [ ] Validate the end-to-end example.

## MVP Outcome

The MVP is complete when a developer can define one controller and obtain all of the following behaviors without hand-wiring the full request lifecycle:

- list records
- fetch a single record
- create a record with schema validation
- update a record with schema validation
- delete a record physically
- delete a record logically
- list logically deleted records
- restore a logically deleted record
- load relations through a documented contract
- expose OpenAPI documentation for the same resource
- log application activity to files

## Product Boundary

### In Scope

- Express as the first server provider
- Sequelize as the first ORM provider
- file-based logging as the first logger provider
- OpenAPI as the first documentation provider
- CRUD-first developer ergonomics
- explicit support for soft delete and restore
- explicit support for relationships
- strong TypeScript typing across all public contracts
- versioned documentation and synchronized repository rules

### Out of Scope

- additional server providers beyond Express
- additional ORM providers beyond Sequelize
- non-file logger providers
- non-OpenAPI documentation providers
- advanced admin panels or UI generation
- framework-specific integrations that are not required for the MVP

## Delivery Principles

- Keep the API agnostic at the core and specific only at the edges.
- Prefer small composable units over large all-in-one abstractions.
- Make every public behavior testable before the implementation is considered complete.
- Use the shared contracts package as the canonical source of truth for cross-repo typing.
- Keep the initial developer experience as short as possible while preserving extensibility.

## MVP Workstreams

### 1. Canonical CRUD Contract

- [ ] Define the final public CRUD shape in `@foundry-api/contracts`.
  - Describe the public resource lifecycle in a provider-agnostic way.
  - Keep the contract flexible enough to support automatic routes and custom routes.
  - Make the contract explicit about which behaviors are required for the MVP and which are optional.
- [ ] Align the CRUD shape with the REST API contract described in the MVP REST CRUD spec.
  - Map each controller behavior to the canonical REST endpoints.
  - Ensure the contract can express list, fetch, create, update, delete, trash, and restore.
- [ ] Decide how list, fetch, create, update, delete, restore, and relation loading are represented at the contract level.
  - Distinguish the transport contract from the persistence contract.
  - Keep relation-loading semantics documented and testable.
- [ ] Define the minimum set of options that must travel across providers.
  - Identify which options belong to the request, controller, repository, or provider boundary.
  - Keep provider-specific options isolated so the core remains agnostic.
- [ ] Establish the request, response, and metadata types that every provider must understand.
  - Include pagination metadata, relation metadata, and validation metadata where needed.
  - Keep response typing precise enough for OpenAPI generation.
- [ ] Document the soft delete semantics so all providers behave the same way.
  - Define hard delete, soft delete, trash listing, and restore.
  - Define how the provider should behave when soft delete is unavailable.
- [ ] Define which operations are mandatory and which are optional.
  - Separate MVP-required operations from controller extension points.
  - Keep the optional surface discoverable but not mandatory for every implementation.
- [ ] Add tests that prove the contract remains stable when implementations change.
  - Cover type-level expectations where practical.
  - Cover runtime contract behavior with deterministic tests.

### 2. Schema and Validation Strategy

- [ ] Define the schema abstraction that the framework will support in the MVP.
  - Decide how schemas are attached to a controller.
  - Keep the schema contract reusable by docs generation and runtime validation.
- [ ] Decide whether the first release will be schema-agnostic or will standardize on one validation shape.
  - Prefer a strategy that avoids binding the core to a single validation engine.
  - If a default validator is introduced later, keep it behind an adapter.
- [ ] Define how create and update schemas differ.
  - Support strict create validation and flexible update validation.
  - Make partial updates explicit instead of implicit.
- [ ] Define how validation errors are represented and surfaced to callers.
  - Keep the error shape consistent across server and ORM providers.
  - Ensure validation failures can be rendered cleanly in HTTP responses.
- [ ] Make sure schema validation can be used without binding the core to a single validation library.
  - Keep the schema interface generic enough for future adapters.
  - Avoid leaking validator-specific syntax into controller definitions.
- [ ] Add tests for valid payloads, invalid payloads, and partial update behavior.
  - Cover both success and failure paths.
  - Verify that invalid payloads fail before persistence side effects.

### 3. Relations Contract

- [ ] Define how relations are declared by a controller or provider.
  - Support named relations and nested relation trees.
  - Keep the relation declaration readable enough for controller authors.
- [ ] Decide how relations are requested at runtime.
  - Support query-driven relation loading.
  - Keep the runtime request format compatible with documentation generation.
- [ ] Define how included relations are passed to Sequelize without leaking ORM-specific behavior into the core.
  - Translate the public contract into ORM-specific include options inside the provider boundary.
  - Keep the core unaware of Sequelize internals.
- [ ] Define how relation metadata is represented in documentation output.
  - Document relation paths, nested relation support, and relation-related query parameters.
  - Ensure OpenAPI output can describe the supported relation surface.
- [ ] Make relation loading explicit so the behavior is predictable and testable.
  - Avoid hidden relation loading defaults.
  - Keep relation loading behavior deterministic across providers.
- [ ] Add tests for included relations and for invalid relation requests.
  - Verify nested includes.
  - Verify invalid paths fail clearly.

### 4. Core CRUD Controller

- [ ] Turn the core controller into the main orchestration point for the MVP.
  - Keep it responsible for composing the CRUD lifecycle, not for implementing transport or persistence.
  - Make it the single place where controller-level behavior is assembled.
- [ ] Define the smallest possible controller configuration that still supports the full CRUD lifecycle.
  - Require only the inputs that are strictly necessary for automatic CRUD generation.
  - Keep the controller usable for custom routes when automation is not wanted.
- [ ] Support automatic REST route generation from the controller configuration.
  - Generate the canonical MVP endpoints from controller metadata.
  - Keep route generation consistent across all server providers.
- [ ] Support custom routes when a controller is created without a model.
  - Allow hand-authored routes to coexist with shared controller infrastructure.
  - Avoid forcing CRUD generation when the developer wants custom behavior only.
- [ ] Route each operation through the shared contracts rather than embedding provider-specific logic.
  - Use the contracts package as the stable interface between layers.
  - Keep ORM and server specifics inside their adapters.
- [ ] Keep controller responsibilities limited to orchestration, not persistence or transport details.
  - Prevent controller bloat by separating responsibilities into mixins or helpers where needed.
  - Keep the controller testable in isolation.
- [ ] Ensure controller hooks, prefixes, entity names, and verbosity flags behave consistently.
  - Support lifecycle hooks for create, update, delete, restore, and read operations.
  - Make naming and route prefix behavior deterministic.
- [ ] Add tests for each controller operation and for controller construction failures.
  - Cover happy paths and invalid configuration paths.
  - Cover model-based and custom-route-only controllers.

### 5. Express Provider

- [ ] Register CRUD routes automatically from the core controller contract.
  - Support registration from controller metadata rather than manual per-route wiring.
  - Keep route registration independent from ORM specifics.
- [ ] Map the canonical endpoints for list, fetch, create, update, delete, trash, and restore.
  - Use the exact REST contract defined in the MVP spec.
  - Preserve route semantics for both static and dynamic controllers.
- [ ] Normalize Express request and response handling behind a provider boundary.
  - Convert HTTP inputs into the framework contract.
  - Keep Express-specific types from leaking into the core layer.
- [ ] Map controller operations to Express handlers without leaking framework-specific details into the core.
  - Keep the provider as the only place that understands Express handler signatures.
  - Preserve a narrow and predictable adapter boundary.
- [ ] Support route registration for list, fetch, create, update, delete, restore, and deleted-list endpoints.
  - Generate trash and restore routes only when soft delete is supported.
  - Keep route creation consistent and idempotent.
- [ ] Keep the provider small enough that it can be replaced by another server framework later.
  - Avoid coupling to Express-only behavior that is not necessary for MVP.
  - Keep the provider reusable as a pattern for future server adapters.
- [ ] Add integration tests for route registration and unsupported method handling.
  - Verify route registration against a realistic router surface.
  - Verify unsupported methods and invalid route definitions fail loudly.

### 6. Sequelize Provider

- [ ] Map the repository contract to Sequelize models and instances.
  - Translate the shared repository API into Sequelize operations.
  - Keep the translation layer isolated from the rest of the framework.
- [ ] Support read, create, update, delete, restore, count, and relation loading behaviors.
  - Ensure every required CRUD path is available through the provider boundary.
  - Keep relation loading compatible with the public contract.
- [ ] Normalize Sequelize instance serialization so callers receive plain data consistently.
  - Return stable record shapes to the rest of the framework.
  - Avoid leaking ORM instance methods outside the provider.
- [ ] Support both hard delete and soft delete semantics.
  - Respect model capabilities when deciding how to delete.
  - Keep trash and restore behavior explicit.
- [ ] Surface clear errors when a required Sequelize capability is missing.
  - Fail with actionable messages when the model does not provide a required method.
  - Distinguish unsupported behavior from data-not-found cases.
- [ ] Add tests for model instances, plain records, missing methods, and soft-delete flows.
  - Cover both instance-backed and plain-object-backed model behavior.
  - Cover restore and trash-related behavior where supported.

### 7. OpenAPI Provider

- [ ] Define how CRUD operations are translated into OpenAPI documents.
  - Map each canonical endpoint to the OpenAPI operation model.
  - Keep the translation predictable and versionable.
- [ ] Allow controller-defined overrides for descriptions, schemas, tags, and response metadata.
  - Support developer customization without losing framework defaults.
  - Allow the generated document to be extended rather than replaced.
- [ ] Capture routes, request bodies, responses, query parameters, and relation hints.
  - Include pagination, filter, include, and fields semantics.
  - Keep relation hints aligned with the controller contract.
- [ ] Make documentation generation deterministic so it can be tested and versioned.
  - Ensure the same controller definition always yields the same document structure.
  - Keep output stable enough for snapshot or structural testing.
- [ ] Keep documentation generation separate from route execution.
  - Avoid runtime coupling between serving requests and generating docs.
  - Keep docs generation pure where possible.
- [ ] Add tests that validate the generated document shape and operation coverage.
  - Verify every canonical CRUD endpoint appears in the output.
  - Verify overrides merge correctly with generated defaults.

### 8. File Logger Provider

- [ ] Define a logger contract that can write structured events to disk.
  - Establish the shape of log records and structured metadata.
  - Keep the contract independent from any particular runtime.
- [ ] Ensure the logger is usable without coupling to a specific runtime framework.
  - Keep it compatible with the same application entry point used by the server provider.
  - Avoid assumptions about Express, Sequelize, or OpenAPI internals.
- [ ] Support log levels and basic metadata propagation.
  - Support the minimum level set required by the MVP.
  - Keep metadata structured and easy to consume.
- [ ] Keep the file sink isolated so other logger providers can be added later.
  - Separate logger contract from storage implementation.
  - Make future logger providers easy to add without breaking the file logger.
- [ ] Add tests for file output, log formatting, and error handling.
  - Verify logs are written with the expected structure.
  - Verify file errors are surfaced predictably.

### 9. Developer Experience

- [ ] Define the final quick-start example that shows how to build a CRUD API in a few lines.
  - Keep the example short enough to be copied directly into a real project.
  - Ensure the example reflects the final MVP contract, not a provisional one.
- [ ] Provide a working example that combines Express, Sequelize, OpenAPI, and file logging.
  - Use the same stack that will ship in the MVP.
  - Keep the example realistic enough to validate the product direction.
- [ ] Keep the example simple enough to copy into a real project.
  - Remove incidental complexity from the example.
  - Keep the happy path obvious.
- [ ] Document how local development works with `yalc`.
  - Explain how `rules` and the shared packages are linked locally.
  - Keep the workflow reproducible for contributors.
- [ ] Document how to sync `rules` into downstream repositories.
  - Keep the synchronization workflow easy to follow.
  - Make sure the process is compatible with the versioned release flow.
- [ ] Add tests or scripted checks that ensure the example stays valid.
  - Prevent the example from drifting away from the actual API.
  - Keep example verification part of the quality gates when practical.

### 10. Quality Gates

- [ ] Enforce ESLint and Prettier in every repo.
  - Keep formatting and linting mandatory rather than optional.
  - Ensure the same tools are used locally and in CI.
- [ ] Keep unit and integration tests required before merge.
  - Prevent merges when the required test suites fail.
  - Keep test execution tied to the quality gate.
- [ ] Preserve a minimum coverage target of 90 percent.
  - Enforce coverage on the relevant code paths, not just on test files.
  - Keep the threshold high enough to preserve confidence without blocking trivial documentation-only changes.
- [ ] Fail fast when any repo violates the quality gates.
  - Surface failures clearly and early.
  - Avoid hidden partial-success states.
- [ ] Ensure CI mirrors the same rules that are enforced locally.
  - Keep local and remote validation aligned.
  - Prevent a divergence between developer workflow and CI.

### 11. Release Readiness

- [ ] Define the versioning and release workflow for the MVP launch.
  - Keep the release process versioned and explicit.
  - Make release naming consistent with the policy docs.
- [ ] Require a changelog entry before any release candidate is cut.
  - Block releases that do not include the latest changes.
  - Keep the changelog aligned with the version being released.
- [ ] Require the repo to be on `main` with the expected branch state before release.
  - Keep release branches and mainline state policy-compliant.
  - Avoid releasing from unreviewed or unexpected branch states.
- [ ] Ensure the rules package can be published and synchronized safely.
  - Keep synchronization tied to the published version.
  - Avoid partial or ambiguous downstream updates.
- [ ] Confirm that downstream repositories can consume the released version without manual patching.
  - Validate the sync workflow against the downstream repos.
  - Keep the process automated enough to avoid repetitive manual edits.

## Suggested Execution Order

1. Lock the canonical contracts.
2. Finalize schema and relation semantics.
3. Finish the core controller behavior.
4. Complete Sequelize support.
5. Complete Express route generation.
6. Add file logging.
7. Add OpenAPI generation.
8. Build and validate the end-to-end example.
9. Harden quality gates and release flow.

## Definition of Done

- A developer can create a CRUD API with a minimal setup.
- The CRUD flow supports list, fetch, create, update, physical delete, logical delete, deleted listing, restore, and relations.
- The stack works with Express, Sequelize, OpenAPI, and file logging.
- The public contracts are documented and tested.
- The example is reproducible in a fresh consumer project.
- The MVP can be released without breaking the repository policies.
