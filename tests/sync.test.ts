import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  renderSynchronizedAgents,
  renderSynchronizedReadme,
} from "../src/sync/markdown";
import { syncRulesToRepository } from "../src/sync/index";

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

test("syncRulesToRepository syncs docs, skills, CONTRIBUTING, README, AGENTS, and package scripts", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "foundry-rules-sync-"));
  const sourceRoot = join(workspace, "rules");
  const targetRoot = join(workspace, "core");

  await mkdir(join(sourceRoot, "docs"), { recursive: true });
  await mkdir(join(sourceRoot, "skills/backend-foundations"), { recursive: true });
  await mkdir(targetRoot, { recursive: true });
  await mkdir(join(targetRoot, "docs"), { recursive: true });
  await mkdir(join(targetRoot, "skills/backend-foundations"), { recursive: true });
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
  await writeFile(join(sourceRoot, "CONTRIBUTING.md"), "# Contributing\n", "utf8");
  await writeFile(join(sourceRoot, "skills/backend-foundations/SKILL.md"), "# Skill\n", "utf8");

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
  await writeFile(join(targetRoot, "skills/backend-foundations/SKILL.md"), "# Old skill\n", "utf8");
  await writeFile(join(targetRoot, "CONTRIBUTING.md"), "# Old contributing\n", "utf8");
  await writeFile(join(targetRoot, "CHANGELOG.md"), "# Changelog\n\n## Unreleased\n\n", "utf8");
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
  assert.ok(result.writtenFiles.some((filePath) => filePath.endsWith("README.md")));
  assert.ok(result.writtenFiles.some((filePath) => filePath.endsWith("AGENTS.md")));
  assert.ok(result.writtenFiles.some((filePath) => filePath.endsWith("CONTRIBUTING.md")));
  assert.ok(result.writtenFiles.some((filePath) => filePath.endsWith("docs/policy.md")));
  assert.ok(
    result.writtenFiles.some((filePath) => filePath.endsWith("skills/backend-foundations/SKILL.md")),
  );
  assert.ok(result.writtenFiles.some((filePath) => filePath.endsWith("package.json")));
  assert.ok(result.writtenFiles.some((filePath) => filePath.endsWith("scripts/sync-rules.cjs")));
  assert.doesNotMatch(await readFile(join(targetRoot, "CHANGELOG.md"), "utf8"), /Synchronized from/);

  assert.match(await readFile(join(targetRoot, "README.md"), "utf8"), /- Source rule/);
  assert.match(await readFile(join(targetRoot, "README.md"), "utf8"), /- Source skill/);
  assert.match(await readFile(join(targetRoot, "README.md"), "utf8"), /Keep this local\./);
  assert.match(await readFile(join(targetRoot, "CONTRIBUTING.md"), "utf8"), /# Contributing/);
  assert.match(await readFile(join(targetRoot, "AGENTS.md"), "utf8"), /- Target local scope/);
  assert.match(await readFile(join(targetRoot, "AGENTS.md"), "utf8"), /- Source synced rule/);
  assert.match(
    await readFile(join(targetRoot, "skills/backend-foundations/SKILL.md"), "utf8"),
    /# Skill/,
  );
  assert.match(await readFile(join(targetRoot, "docs/policy.md"), "utf8"), /# Policy/);
  await assert.rejects(readFile(join(targetRoot, "docs/old.md"), "utf8"));
  assert.match(await readFile(join(targetRoot, "package.json"), "utf8"), /"sync:rules"/);
  assert.match(await readFile(join(targetRoot, "scripts/sync-rules.cjs"), "utf8"), /syncRulesToRepository/);
});

test("syncRulesToRepository bootstraps a changelog when the target does not have one", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "foundry-rules-changelog-"));
  const sourceRoot = join(workspace, "rules");
  const targetRoot = join(workspace, "contracts");

  await mkdir(join(sourceRoot, "docs"), { recursive: true });
  await mkdir(join(sourceRoot, "skills/backend-foundations"), { recursive: true });
  await mkdir(targetRoot, { recursive: true });
  await mkdir(join(targetRoot, "docs"), { recursive: true });
  await mkdir(join(targetRoot, "skills/backend-foundations"), { recursive: true });

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
  await writeFile(join(sourceRoot, "CONTRIBUTING.md"), "# Contributing\n", "utf8");
  await writeFile(join(sourceRoot, "skills/backend-foundations/SKILL.md"), "# Skill\n", "utf8");

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
  await writeFile(join(targetRoot, "skills/backend-foundations/SKILL.md"), "# Old skill\n", "utf8");
  await writeFile(join(targetRoot, "CONTRIBUTING.md"), "# Old contributing\n", "utf8");
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

  assert.ok(result.writtenFiles.some((filePath) => filePath.endsWith("CHANGELOG.md")));
  assert.ok(result.writtenFiles.some((filePath) => filePath.endsWith("CONTRIBUTING.md")));
  assert.match(await readFile(join(targetRoot, "CHANGELOG.md"), "utf8"), /Synchronized from/);
  assert.match(await readFile(join(targetRoot, "CONTRIBUTING.md"), "utf8"), /# Contributing/);
});
