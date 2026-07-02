import {
	copyFile,
	mkdir,
	readdir,
	readFile,
	unlink,
	writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import {
	AGENTS_FILE_NAME,
	BACKEND_FOUNDATIONS_SKILL_PATH,
	CHANGELOG_FILE_NAME,
	CONTRIBUTING_FILE_NAME,
	DOCUMENTATION_DIRECTORY_NAME,
	README_FILE_NAME,
	SYNC_RULES_SCRIPT_NAME,
	SYNC_RULES_SCRIPT_PATH,
} from "./constants";
import { renderChangelogSkeleton } from "./changelog";
import { renderSyncHelper } from "./helper";
import { renderSynchronizedAgents, renderSynchronizedReadme } from "./markdown";
import { ensurePackageSyncScript, ensureSyncHelperFile } from "./package-json";
import type {
	SyncRepositoryOptions,
	SyncRepositoryResult,
	SyncWorkspaceOptions,
	SyncWorkspaceResult,
} from "./types";

/**
 * Synchronize the rules repository into one downstream repository.
 *
 * @param options - The synchronization options.
 * @returns A result describing which files were updated.
 * @throws {Error} Throws when required source files are missing.
 * @example
 * ```ts
 * await syncRulesToRepository({
 *   targetRepositoryPath: "/Users/raymundo.salazar/Documents/_WORK/_FOUNDRY/core",
 * });
 * ```
 */
export async function syncRulesToRepository(
	options: SyncRepositoryOptions,
): Promise<SyncRepositoryResult> {
	const sourceRepositoryPath = resolveSourceRepositoryPath(
		options.sourceRepositoryPath,
	);
	const targetRepositoryPath = resolve(options.targetRepositoryPath);
	const generatedAtUtc = options.generatedAtUtc ?? new Date().toISOString();

	const sourceReadme = await readTextFile(
		join(sourceRepositoryPath, README_FILE_NAME),
	);
	const sourceAgents = await readTextFile(
		join(sourceRepositoryPath, AGENTS_FILE_NAME),
	);
	const sourceContributing = await readTextFile(
		join(sourceRepositoryPath, CONTRIBUTING_FILE_NAME),
	);

	const targetReadmePath = join(targetRepositoryPath, README_FILE_NAME);
	const targetAgentsPath = join(targetRepositoryPath, AGENTS_FILE_NAME);
	const targetContributingPath = join(
		targetRepositoryPath,
		CONTRIBUTING_FILE_NAME,
	);
	const targetChangelogPath = join(targetRepositoryPath, CHANGELOG_FILE_NAME);
	const targetDocsPath = join(
		targetRepositoryPath,
		DOCUMENTATION_DIRECTORY_NAME,
	);
	const targetSkillPath = join(
		targetRepositoryPath,
		BACKEND_FOUNDATIONS_SKILL_PATH,
	);
	const sourceDocsPath = join(
		sourceRepositoryPath,
		DOCUMENTATION_DIRECTORY_NAME,
	);
	const sourceSkillPath = join(
		sourceRepositoryPath,
		BACKEND_FOUNDATIONS_SKILL_PATH,
	);
	const targetPackageJsonPath = join(targetRepositoryPath, "package.json");
	const targetSyncHelperPath = join(
		targetRepositoryPath,
		SYNC_RULES_SCRIPT_PATH,
	);

	const writtenFiles = new Set<string>();

	await ensureDirectory(targetRepositoryPath);
	await ensureDirectory(targetDocsPath);
	await ensureDirectory(dirname(targetSkillPath));

	const sourceDocsFiles = await listMarkdownFiles(sourceDocsPath);
	const sourceDocRelativePaths = new Set<string>();
	for (const sourceDocFile of sourceDocsFiles) {
		const relativeFilePath = sourceDocFile.slice(sourceDocsPath.length + 1);
		sourceDocRelativePaths.add(relativeFilePath);
		const targetDocFile = join(targetDocsPath, relativeFilePath);
		await ensureDirectory(dirname(targetDocFile));
		await copyFile(sourceDocFile, targetDocFile);
		writtenFiles.add(targetDocFile);
	}

	const targetDocsFiles = await listMarkdownFiles(targetDocsPath);
	for (const targetDocFile of targetDocsFiles) {
		const relativeFilePath = targetDocFile.slice(targetDocsPath.length + 1);
		if (!sourceDocRelativePaths.has(relativeFilePath)) {
			await unlink(targetDocFile);
			writtenFiles.add(targetDocFile);
		}
	}

	await copyFile(sourceSkillPath, targetSkillPath);
	writtenFiles.add(targetSkillPath);

	const targetReadme = await readTextFile(targetReadmePath);
	const nextReadme = renderSynchronizedReadme(sourceReadme, targetReadme);
	await writeTextFile(targetReadmePath, nextReadme);
	writtenFiles.add(targetReadmePath);

	const targetAgents = await readTextFile(targetAgentsPath);
	const nextAgents = renderSynchronizedAgents(
		sourceAgents,
		targetAgents,
		sourceRepositoryPath,
		generatedAtUtc,
	);
	await writeTextFile(targetAgentsPath, nextAgents);
	writtenFiles.add(targetAgentsPath);

	await writeTextFile(targetContributingPath, sourceContributing);
	writtenFiles.add(targetContributingPath);

	const helperContents = renderSyncHelper();
	const helperWritten = await ensureSyncHelperFile(
		targetSyncHelperPath,
		helperContents,
	);
	if (helperWritten) {
		writtenFiles.add(targetSyncHelperPath);
	}

	const packageJsonChanged = await ensurePackageSyncScript(
		targetPackageJsonPath,
		SYNC_RULES_SCRIPT_NAME,
		"node scripts/sync-rules.cjs",
	);
	if (packageJsonChanged) {
		writtenFiles.add(targetPackageJsonPath);
	}

	const changelogWritten = await ensureChangelogFile(
		targetChangelogPath,
		generatedAtUtc,
		sourceRepositoryPath,
	);
	if (changelogWritten) {
		writtenFiles.add(targetChangelogPath);
	}

	return {
		repositoryPath: targetRepositoryPath,
		writtenFiles: Array.from(writtenFiles),
	};
}

/**
 * Synchronize the rules repository into multiple downstream repositories.
 *
 * @param options - The workspace synchronization options.
 * @returns The aggregate synchronization result.
 * @example
 * ```ts
 * await syncRulesToWorkspace({
 *   targets: [{ repositoryPath: "/Users/raymundo.salazar/Documents/_WORK/_FOUNDRY/core" }],
 * });
 * ```
 */
export async function syncRulesToWorkspace(
	options: SyncWorkspaceOptions,
): Promise<SyncWorkspaceResult> {
	const repositories = [];

	for (const target of options.targets) {
		repositories.push(
			await syncRulesToRepository({
				sourceRepositoryPath: options.sourceRepositoryPath,
				targetRepositoryPath: target.repositoryPath,
				generatedAtUtc: options.generatedAtUtc,
			}),
		);
	}

	return { repositories };
}

/**
 * Read a text file from disk.
 *
 * @param filePath - The path to the file to read.
 * @returns The file contents.
 */
async function readTextFile(filePath: string): Promise<string> {
	return readFile(filePath, "utf8");
}

/**
 * Write a text file to disk, creating parent directories as needed.
 *
 * @param filePath - The path to write.
 * @param contents - The file contents to persist.
 */
async function writeTextFile(
	filePath: string,
	contents: string,
): Promise<void> {
	await ensureDirectory(dirname(filePath));
	await writeFile(filePath, contents, "utf8");
}

/**
 * Ensure a directory exists.
 *
 * @param directoryPath - The directory to create.
 */
async function ensureDirectory(directoryPath: string): Promise<void> {
	await mkdir(directoryPath, { recursive: true });
}

/**
 * Resolve the source repository path from the current package when not provided.
 *
 * @param sourceRepositoryPath - The explicit source repository path.
 * @returns The absolute source repository path.
 */
function resolveSourceRepositoryPath(
	sourceRepositoryPath: string | undefined,
): string {
	if (sourceRepositoryPath !== undefined) {
		return resolve(sourceRepositoryPath);
	}

	return resolve(dirname(dirname(__dirname)));
}

/**
 * Collect Markdown files from a directory.
 *
 * @param directoryPath - The directory to scan.
 * @returns A sorted list of absolute file paths.
 */
async function listMarkdownFiles(
	directoryPath: string,
): Promise<readonly string[]> {
	const entries = await readdir(directoryPath, { withFileTypes: true });
	const filePaths = [];

	for (const entry of entries) {
		const entryPath = join(directoryPath, entry.name);

		if (entry.isDirectory()) {
			filePaths.push(...(await listMarkdownFiles(entryPath)));
			continue;
		}

		if (entry.isFile() && entry.name.endsWith(".md")) {
			filePaths.push(entryPath);
		}
	}

	return filePaths.sort((left, right) => left.localeCompare(right));
}

/**
 * Ensure a changelog exists in the target repository.
 *
 * @param changelogPath - The target changelog path.
 * @param generatedAtUtc - The UTC timestamp for the sync run.
 * @param sourceRepositoryPath - The source repository path used for the sync.
 * @returns A boolean indicating whether the changelog was created.
 */
async function ensureChangelogFile(
	changelogPath: string,
	generatedAtUtc: string,
	sourceRepositoryPath: string,
): Promise<boolean> {
	try {
		await readTextFile(changelogPath);
		return false;
	} catch {
		await writeTextFile(
			changelogPath,
			renderChangelogSkeleton(generatedAtUtc, sourceRepositoryPath),
		);
		return true;
	}
}

/**
 * Synchronize the rules repository into one downstream repository.
 *
 * @deprecated Use `syncRulesToRepository`.
 * @param options - The synchronization options.
 * @returns A result describing which files were updated.
 * @example
 * ```ts
 * await syncFoundryApiRulesToRepository({
 *   targetRepositoryPath: "/Users/raymundo.salazar/Documents/_WORK/_FOUNDRY/core",
 * });
 * ```
 */
export async function syncFoundryApiRulesToRepository(
	options: SyncRepositoryOptions,
): Promise<SyncRepositoryResult> {
	return syncRulesToRepository(options);
}

/**
 * Synchronize the rules repository into multiple downstream repositories.
 *
 * @deprecated Use `syncRulesToWorkspace`.
 * @param options - The workspace synchronization options.
 * @returns The aggregate synchronization result.
 * @example
 * ```ts
 * await syncFoundryApiRulesToWorkspace({
 *   targets: [{ repositoryPath: "/Users/raymundo.salazar/Documents/_WORK/_FOUNDRY/core" }],
 * });
 * ```
 */
export async function syncFoundryApiRulesToWorkspace(
	options: SyncWorkspaceOptions,
): Promise<SyncWorkspaceResult> {
	return syncRulesToWorkspace(options);
}
