import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
	renderSynchronizedAgents,
	renderSynchronizedReadme,
} from "../src/sync/markdown";
import {
	syncFoundryApiRulesToRepository,
	syncFoundryApiRulesToWorkspace,
	syncRulesToRepository,
	syncRulesToWorkspace,
} from "../src/sync/index";

test("renderSynchronizedReadme replaces rules and skills sections", () => {
	const sourceReadme = [
		"# Source",
		"",
		"## Rules",
		"",
		"- Source rule",
		"",
		"## Skills",
		"",
		"- Source skill",
		"",
	].join("\n");

	const targetReadme = [
		"# Target",
		"",
		"## Rules",
		"",
		"- Target rule",
		"",
		"## Skills",
		"",
		"- Target skill",
		"",
		"## Standard",
		"",
		"Keep this local.",
		"",
	].join("\n");

	const result = renderSynchronizedReadme(sourceReadme, targetReadme);

	assert.match(result, /- Source rule/);
	assert.match(result, /- Source skill/);
	assert.match(result, /## Standard/);
	assert.match(result, /Keep this local\./);
	assert.doesNotMatch(result, /- Target rule/);
	assert.doesNotMatch(result, /- Target skill/);
});

test("renderSynchronizedAgents preserves local scope and refreshes header", () => {
	const sourceAgents = [
		"<!-- AUTO-GENERATED FROM: /source -->",
		"<!-- GENERATED_AT_UTC: 2026-07-01T00:00:00Z -->",
		"<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->",
		"",
		"# AGENTS",
		"",
		"Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.",
		"",
		"## Local Scope",
		"",
		"- Source local scope",
		"",
		"## Synced Global Rules",
		"",
		"- Source synced rule",
		"",
	].join("\n");

	const targetAgents = [
		"<!-- AUTO-GENERATED FROM: /target -->",
		"<!-- GENERATED_AT_UTC: 2026-07-01T00:00:00Z -->",
		"<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->",
		"",
		"# AGENTS",
		"",
		"Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.",
		"",
		"## Local Scope",
		"",
		"- Target local scope",
		"",
		"## Synced Global Rules",
		"",
		"- Target synced rule",
		"",
	].join("\n");

	const result = renderSynchronizedAgents(
		sourceAgents,
		targetAgents,
		"/source",
		"2026-07-01T16:12:23Z",
	);

	assert.match(result, /AUTO-GENERATED FROM: \/source/);
	assert.match(result, /GENERATED_AT_UTC: 2026-07-01T16:12:23Z/);
	assert.match(result, /- Target local scope/);
	assert.match(result, /- Source synced rule/);
	assert.doesNotMatch(result, /- Target synced rule/);
});

test("renderSynchronizedReadme throws when required sections are missing", () => {
	assert.throws(
		() =>
			renderSynchronizedReadme(
				["# Source", "", "## Rules", "", "- Source rule", ""].join("\n"),
				[
					"# Target",
					"",
					"## Rules",
					"",
					"- Target rule",
					"",
					"## Skills",
					"",
					"- Target skill",
					"",
				].join("\n"),
			),
		/Could not find markdown heading: ## Skills/,
	);
});

test("syncRulesToRepository syncs docs, skills, CONTRIBUTING, README, AGENTS, and package scripts", async () => {
	const workspace = await mkdtemp(join(tmpdir(), "foundry-rules-sync-"));
	const sourceRoot = join(workspace, "rules");
	const targetRoot = join(workspace, "core");

	await mkdir(join(sourceRoot, "docs"), { recursive: true });
	await mkdir(join(sourceRoot, "skills/backend-foundations"), {
		recursive: true,
	});
	await mkdir(targetRoot, { recursive: true });
	await mkdir(join(targetRoot, "docs"), { recursive: true });
	await mkdir(join(targetRoot, "skills/backend-foundations"), {
		recursive: true,
	});
	await mkdir(join(targetRoot, "scripts"), { recursive: true });

	await writeFile(
		join(sourceRoot, "README.md"),
		[
			"# Source",
			"",
			"## Rules",
			"",
			"- Source rule",
			"",
			"## Skills",
			"",
			"- Source skill",
			"",
		].join("\n"),
		"utf8",
	);

	await writeFile(
		join(sourceRoot, "AGENTS.md"),
		[
			"<!-- AUTO-GENERATED FROM: /source -->",
			"<!-- GENERATED_AT_UTC: 2026-07-01T00:00:00Z -->",
			"<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->",
			"",
			"# AGENTS",
			"",
			"Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.",
			"",
			"## Local Scope",
			"",
			"- Source local scope",
			"",
			"## Synced Global Rules",
			"",
			"- Source synced rule",
			"",
		].join("\n"),
		"utf8",
	);

	await writeFile(join(sourceRoot, "docs/policy.md"), "# Policy\n", "utf8");
	await writeFile(
		join(sourceRoot, "CONTRIBUTING.md"),
		"# Contributing\n",
		"utf8",
	);
	await writeFile(
		join(sourceRoot, "skills/backend-foundations/SKILL.md"),
		"# Skill\n",
		"utf8",
	);

	await writeFile(
		join(targetRoot, "README.md"),
		[
			"# Target",
			"",
			"## Rules",
			"",
			"- Target rule",
			"",
			"## Skills",
			"",
			"- Target skill",
			"",
			"## Standard",
			"",
			"Keep this local.",
			"",
		].join("\n"),
		"utf8",
	);

	await writeFile(
		join(targetRoot, "AGENTS.md"),
		[
			"<!-- AUTO-GENERATED FROM: /target -->",
			"<!-- GENERATED_AT_UTC: 2026-07-01T00:00:00Z -->",
			"<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->",
			"",
			"# AGENTS",
			"",
			"Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.",
			"",
			"## Local Scope",
			"",
			"- Target local scope",
			"",
			"## Synced Global Rules",
			"",
			"- Target synced rule",
			"",
		].join("\n"),
		"utf8",
	);

	await writeFile(join(targetRoot, "docs/old.md"), "# Old\n", "utf8");
	await writeFile(
		join(targetRoot, "skills/backend-foundations/SKILL.md"),
		"# Old skill\n",
		"utf8",
	);
	await writeFile(
		join(targetRoot, "CONTRIBUTING.md"),
		"# Old contributing\n",
		"utf8",
	);
	await writeFile(
		join(targetRoot, "CHANGELOG.md"),
		"# Changelog\n\n## Unreleased\n\n",
		"utf8",
	);
	await writeFile(
		join(targetRoot, "package.json"),
		JSON.stringify(
			{
				name: "@foundry-api/core",
				version: "0.1.0",
				scripts: {
					test: "node --test",
				},
			},
			null,
			"\t",
		),
		"utf8",
	);

	const result = await syncRulesToRepository({
		sourceRepositoryPath: sourceRoot,
		targetRepositoryPath: targetRoot,
		generatedAtUtc: "2026-07-01T16:12:23Z",
	});

	assert.equal(result.repositoryPath, targetRoot);
	assert.ok(
		result.writtenFiles.some((filePath) => filePath.endsWith("README.md")),
	);
	assert.ok(
		result.writtenFiles.some((filePath) => filePath.endsWith("AGENTS.md")),
	);
	assert.ok(
		result.writtenFiles.some((filePath) =>
			filePath.endsWith("CONTRIBUTING.md"),
		),
	);
	assert.ok(
		result.writtenFiles.some((filePath) => filePath.endsWith("docs/policy.md")),
	);
	assert.ok(
		result.writtenFiles.some((filePath) =>
			filePath.endsWith("skills/backend-foundations/SKILL.md"),
		),
	);
	assert.ok(
		result.writtenFiles.some((filePath) => filePath.endsWith("package.json")),
	);
	assert.ok(
		result.writtenFiles.some((filePath) =>
			filePath.endsWith("scripts/sync-rules.cjs"),
		),
	);
	assert.doesNotMatch(
		await readFile(join(targetRoot, "CHANGELOG.md"), "utf8"),
		/Synchronized from/,
	);

	assert.match(
		await readFile(join(targetRoot, "README.md"), "utf8"),
		/- Source rule/,
	);
	assert.match(
		await readFile(join(targetRoot, "README.md"), "utf8"),
		/- Source skill/,
	);
	assert.match(
		await readFile(join(targetRoot, "README.md"), "utf8"),
		/Keep this local\./,
	);
	assert.match(
		await readFile(join(targetRoot, "CONTRIBUTING.md"), "utf8"),
		/# Contributing/,
	);
	assert.match(
		await readFile(join(targetRoot, "AGENTS.md"), "utf8"),
		/- Target local scope/,
	);
	assert.match(
		await readFile(join(targetRoot, "AGENTS.md"), "utf8"),
		/- Source synced rule/,
	);
	assert.match(
		await readFile(
			join(targetRoot, "skills/backend-foundations/SKILL.md"),
			"utf8",
		),
		/# Skill/,
	);
	assert.match(
		await readFile(join(targetRoot, "docs/policy.md"), "utf8"),
		/# Policy/,
	);
	await assert.rejects(readFile(join(targetRoot, "docs/old.md"), "utf8"));
	assert.match(
		await readFile(join(targetRoot, "package.json"), "utf8"),
		/"sync:rules"/,
	);
	assert.match(
		await readFile(join(targetRoot, "scripts/sync-rules.cjs"), "utf8"),
		/syncRulesToRepository/,
	);
});

test("syncRulesToRepository bootstraps a changelog when the target does not have one", async () => {
	const workspace = await mkdtemp(join(tmpdir(), "foundry-rules-changelog-"));
	const sourceRoot = join(workspace, "rules");
	const targetRoot = join(workspace, "contracts");

	await mkdir(join(sourceRoot, "docs"), { recursive: true });
	await mkdir(join(sourceRoot, "skills/backend-foundations"), {
		recursive: true,
	});
	await mkdir(targetRoot, { recursive: true });
	await mkdir(join(targetRoot, "docs"), { recursive: true });
	await mkdir(join(targetRoot, "skills/backend-foundations"), {
		recursive: true,
	});

	await writeFile(
		join(sourceRoot, "README.md"),
		[
			"# Source",
			"",
			"## Rules",
			"",
			"- Source rule",
			"",
			"## Skills",
			"",
			"- Source skill",
			"",
		].join("\n"),
		"utf8",
	);

	await writeFile(
		join(sourceRoot, "AGENTS.md"),
		[
			"<!-- AUTO-GENERATED FROM: /source -->",
			"<!-- GENERATED_AT_UTC: 2026-07-01T00:00:00Z -->",
			"<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->",
			"",
			"# AGENTS",
			"",
			"Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.",
			"",
			"## Local Scope",
			"",
			"- Source local scope",
			"",
			"## Synced Global Rules",
			"",
			"- Source synced rule",
			"",
		].join("\n"),
		"utf8",
	);

	await writeFile(join(sourceRoot, "docs/policy.md"), "# Policy\n", "utf8");
	await writeFile(
		join(sourceRoot, "CONTRIBUTING.md"),
		"# Contributing\n",
		"utf8",
	);
	await writeFile(
		join(sourceRoot, "skills/backend-foundations/SKILL.md"),
		"# Skill\n",
		"utf8",
	);

	await writeFile(
		join(targetRoot, "README.md"),
		[
			"# Target",
			"",
			"## Rules",
			"",
			"- Target rule",
			"",
			"## Skills",
			"",
			"- Target skill",
			"",
		].join("\n"),
		"utf8",
	);

	await writeFile(
		join(targetRoot, "AGENTS.md"),
		[
			"<!-- AUTO-GENERATED FROM: /target -->",
			"<!-- GENERATED_AT_UTC: 2026-07-01T00:00:00Z -->",
			"<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->",
			"",
			"# AGENTS",
			"",
			"Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.",
			"",
			"## Local Scope",
			"",
			"- Target local scope",
			"",
			"## Synced Global Rules",
			"",
			"- Target synced rule",
			"",
		].join("\n"),
		"utf8",
	);

	await writeFile(join(targetRoot, "docs/old.md"), "# Old\n", "utf8");
	await writeFile(
		join(targetRoot, "skills/backend-foundations/SKILL.md"),
		"# Old skill\n",
		"utf8",
	);
	await writeFile(
		join(targetRoot, "CONTRIBUTING.md"),
		"# Old contributing\n",
		"utf8",
	);
	await writeFile(
		join(targetRoot, "package.json"),
		JSON.stringify(
			{
				name: "@foundry-api/contracts",
				version: "0.1.0",
			},
			null,
			"\t",
		),
		"utf8",
	);

	const result = await syncRulesToRepository({
		sourceRepositoryPath: sourceRoot,
		targetRepositoryPath: targetRoot,
		generatedAtUtc: "2026-07-02T02:59:47Z",
	});

	assert.ok(
		result.writtenFiles.some((filePath) => filePath.endsWith("CHANGELOG.md")),
	);
	assert.ok(
		result.writtenFiles.some((filePath) =>
			filePath.endsWith("CONTRIBUTING.md"),
		),
	);
	assert.match(
		await readFile(join(targetRoot, "CHANGELOG.md"), "utf8"),
		/Synchronized from/,
	);
	assert.match(
		await readFile(join(targetRoot, "CONTRIBUTING.md"), "utf8"),
		/# Contributing/,
	);
});

test("syncRulesToRepository preserves existing sync helper and sync script settings", async () => {
	const workspace = await mkdtemp(
		join(tmpdir(), "foundry-rules-existing-sync-"),
	);
	const sourceRoot = join(workspace, "rules");
	const targetRoot = join(workspace, "core");

	await mkdir(join(sourceRoot, "docs/nested"), { recursive: true });
	await mkdir(join(sourceRoot, "skills/backend-foundations"), {
		recursive: true,
	});
	await mkdir(targetRoot, { recursive: true });
	await mkdir(join(targetRoot, "docs"), { recursive: true });
	await mkdir(join(targetRoot, "skills/backend-foundations"), {
		recursive: true,
	});
	await mkdir(join(targetRoot, "scripts"), { recursive: true });

	await writeFile(
		join(sourceRoot, "README.md"),
		[
			"# Source",
			"",
			"## Rules",
			"",
			"- Source rule",
			"",
			"## Skills",
			"",
			"- Source skill",
			"",
		].join("\n"),
		"utf8",
	);

	await writeFile(
		join(sourceRoot, "AGENTS.md"),
		[
			"<!-- AUTO-GENERATED FROM: /source -->",
			"<!-- GENERATED_AT_UTC: 2026-07-01T00:00:00Z -->",
			"<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->",
			"",
			"# AGENTS",
			"",
			"Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.",
			"",
			"## Local Scope",
			"",
			"- Source local scope",
			"",
			"## Synced Global Rules",
			"",
			"- Source synced rule",
			"",
		].join("\n"),
		"utf8",
	);

	await writeFile(join(sourceRoot, "docs/policy.md"), "# Policy\n", "utf8");
	await writeFile(
		join(sourceRoot, "docs/nested/guide.md"),
		"# Guide\n",
		"utf8",
	);
	await writeFile(
		join(sourceRoot, "CONTRIBUTING.md"),
		"# Contributing\n",
		"utf8",
	);
	await writeFile(
		join(sourceRoot, "skills/backend-foundations/SKILL.md"),
		"# Skill\n",
		"utf8",
	);

	await writeFile(
		join(targetRoot, "README.md"),
		[
			"# Target",
			"",
			"## Rules",
			"",
			"- Target rule",
			"",
			"## Skills",
			"",
			"- Target skill",
			"",
			"## Standard",
			"",
			"Keep this local.",
			"",
		].join("\n"),
		"utf8",
	);

	await writeFile(
		join(targetRoot, "AGENTS.md"),
		[
			"<!-- AUTO-GENERATED FROM: /target -->",
			"<!-- GENERATED_AT_UTC: 2026-07-01T00:00:00Z -->",
			"<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->",
			"",
			"# AGENTS",
			"",
			"Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.",
			"",
			"## Local Scope",
			"",
			"- Target local scope",
			"",
			"## Synced Global Rules",
			"",
			"- Target synced rule",
			"",
		].join("\n"),
		"utf8",
	);

	await writeFile(join(targetRoot, "docs/old.md"), "# Old\n", "utf8");
	await writeFile(
		join(targetRoot, "skills/backend-foundations/SKILL.md"),
		"# Old skill\n",
		"utf8",
	);
	await writeFile(
		join(targetRoot, "CONTRIBUTING.md"),
		"# Contributing\n",
		"utf8",
	);
	await writeFile(
		join(targetRoot, "scripts/sync-rules.cjs"),
		"console.log('keep me');\n",
		"utf8",
	);
	await writeFile(
		join(targetRoot, "package.json"),
		JSON.stringify(
			{
				name: "@foundry-api/core",
				version: "0.1.0",
				scripts: {
					test: "node --test",
					"sync:rules": "node scripts/other.cjs",
				},
			},
			null,
			"\t",
		),
		"utf8",
	);

	const result = await syncRulesToRepository({
		sourceRepositoryPath: sourceRoot,
		targetRepositoryPath: targetRoot,
		generatedAtUtc: "2026-07-02T02:59:47Z",
	});

	assert.ok(
		!result.writtenFiles.some((filePath) => filePath.endsWith("package.json")),
	);
	assert.ok(
		!result.writtenFiles.some((filePath) =>
			filePath.endsWith("scripts/sync-rules.cjs"),
		),
	);
	assert.match(
		await readFile(join(targetRoot, "docs/nested/guide.md"), "utf8"),
		/# Guide/,
	);
	assert.match(
		await readFile(join(targetRoot, "scripts/sync-rules.cjs"), "utf8"),
		/keep me/,
	);
	assert.match(
		await readFile(join(targetRoot, "package.json"), "utf8"),
		/node scripts\/other.cjs/,
	);
});

test("syncRulesToWorkspace syncs multiple repositories using the default source repository", async () => {
	const workspace = await mkdtemp(join(tmpdir(), "foundry-rules-workspace-"));
	const targetOne = join(workspace, "core");
	const targetTwo = join(workspace, "contracts");

	await mkdir(targetOne, { recursive: true });
	await mkdir(join(targetOne, "docs"), { recursive: true });
	await mkdir(join(targetOne, "skills/backend-foundations"), {
		recursive: true,
	});
	await mkdir(join(targetOne, "scripts"), { recursive: true });
	await writeFile(
		join(targetOne, "README.md"),
		[
			"# Target",
			"",
			"## Rules",
			"",
			"- Target rule",
			"",
			"## Skills",
			"",
			"- Target skill",
			"",
		].join("\n"),
		"utf8",
	);
	await writeFile(
		join(targetOne, "AGENTS.md"),
		[
			"<!-- AUTO-GENERATED FROM: /target -->",
			"<!-- GENERATED_AT_UTC: 2026-07-01T00:00:00Z -->",
			"<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->",
			"",
			"# AGENTS",
			"",
			"Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.",
			"",
			"## Local Scope",
			"",
			"- Target local scope",
			"",
			"## Synced Global Rules",
			"",
			"- Target synced rule",
			"",
		].join("\n"),
		"utf8",
	);
	await writeFile(
		join(targetOne, "CHANGELOG.md"),
		"# Changelog\n\n## Unreleased\n\n",
		"utf8",
	);
	await writeFile(
		join(targetOne, "package.json"),
		JSON.stringify(
			{
				name: "@foundry-api/core",
				version: "0.1.0",
			},
			null,
			"\t",
		),
		"utf8",
	);

	await mkdir(targetTwo, { recursive: true });
	await mkdir(join(targetTwo, "docs"), { recursive: true });
	await mkdir(join(targetTwo, "skills/backend-foundations"), {
		recursive: true,
	});
	await writeFile(
		join(targetTwo, "README.md"),
		[
			"# Target",
			"",
			"## Rules",
			"",
			"- Target rule",
			"",
			"## Skills",
			"",
			"- Target skill",
			"",
		].join("\n"),
		"utf8",
	);
	await writeFile(
		join(targetTwo, "AGENTS.md"),
		[
			"<!-- AUTO-GENERATED FROM: /target -->",
			"<!-- GENERATED_AT_UTC: 2026-07-01T00:00:00Z -->",
			"<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->",
			"",
			"# AGENTS",
			"",
			"Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.",
			"",
			"## Local Scope",
			"",
			"- Target local scope",
			"",
			"## Synced Global Rules",
			"",
			"- Target synced rule",
			"",
		].join("\n"),
		"utf8",
	);
	await writeFile(
		join(targetTwo, "CHANGELOG.md"),
		"# Changelog\n\n## Unreleased\n\n",
		"utf8",
	);
	await writeFile(
		join(targetTwo, "package.json"),
		JSON.stringify(
			{
				name: "@foundry-api/contracts",
				version: "0.1.0",
			},
			null,
			"\t",
		),
		"utf8",
	);

	const result = await syncRulesToWorkspace({
		targets: [{ repositoryPath: targetOne }, { repositoryPath: targetTwo }],
	});

	assert.equal(result.repositories.length, 2);
	assert.match(
		await readFile(join(targetOne, "README.md"), "utf8"),
		/- \[Architecture\]/,
	);
	assert.match(
		await readFile(join(targetTwo, "README.md"), "utf8"),
		/- \[Backend Foundations\]/,
	);
});

test("deprecated sync aliases delegate to the current sync APIs", async () => {
	const workspace = await mkdtemp(join(tmpdir(), "foundry-rules-alias-"));
	const targetRoot = join(workspace, "provider");

	await mkdir(join(targetRoot, "docs"), { recursive: true });
	await mkdir(join(targetRoot, "skills/backend-foundations"), {
		recursive: true,
	});
	await writeFile(
		join(targetRoot, "README.md"),
		[
			"# Target",
			"",
			"## Rules",
			"",
			"- Target rule",
			"",
			"## Skills",
			"",
			"- Target skill",
			"",
		].join("\n"),
		"utf8",
	);
	await writeFile(
		join(targetRoot, "AGENTS.md"),
		[
			"<!-- AUTO-GENERATED FROM: /target -->",
			"<!-- GENERATED_AT_UTC: 2026-07-01T00:00:00Z -->",
			"<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->",
			"",
			"# AGENTS",
			"",
			"Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.",
			"",
			"## Local Scope",
			"",
			"- Target local scope",
			"",
			"## Synced Global Rules",
			"",
			"- Target synced rule",
			"",
		].join("\n"),
		"utf8",
	);
	await writeFile(
		join(targetRoot, "CHANGELOG.md"),
		"# Changelog\n\n## Unreleased\n\n",
		"utf8",
	);
	await writeFile(
		join(targetRoot, "package.json"),
		JSON.stringify(
			{
				name: "@foundry-api/provider-server-express",
				version: "0.1.0",
			},
			null,
			"\t",
		),
		"utf8",
	);

	const repositoryResult = await syncFoundryApiRulesToRepository({
		targetRepositoryPath: targetRoot,
	});
	const workspaceResult = await syncFoundryApiRulesToWorkspace({
		targets: [{ repositoryPath: targetRoot }],
	});

	assert.equal(repositoryResult.repositoryPath, targetRoot);
	assert.equal(workspaceResult.repositories.length, 1);
	assert.match(
		await readFile(join(targetRoot, "README.md"), "utf8"),
		/- \[Architecture\]/,
	);
});
