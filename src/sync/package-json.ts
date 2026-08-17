import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * The minimal package.json shape required by the synchronization engine.
 *
 * @name PackageJsonDocument
 */
export interface PackageJsonDocument {
	/**
	 * Package scripts keyed by command name.
	 */
	readonly scripts?: Record<string, string>;

	/**
	 * Remaining package metadata.
	 */
	readonly [key: string]: unknown;
}

/**
 * Ensure a package.json contains a repository sync script and helper file.
 *
 * @param packageJsonPath - The path to the target package.json file.
 * @param scriptName - The package script name to ensure.
 * @param scriptCommand - The command that the package script should execute.
 * @returns A boolean indicating whether package.json changed.
 * @throws {Error} Throws when the package.json file cannot be parsed.
 */
export async function ensurePackageSyncScript(
	packageJsonPath: string,
	scriptName: string,
	scriptCommand: string,
): Promise<boolean> {
	const packageJson = await readPackageJson(packageJsonPath);
	const nextPackageJson = applySyncScript(
		packageJson,
		scriptName,
		scriptCommand,
	);
	const packageJsonChanged = nextPackageJson !== packageJson;

	if (packageJsonChanged) {
		await writePackageJson(packageJsonPath, nextPackageJson);
	}

	return packageJsonChanged;
}

/**
 * Write the sync helper file if it does not already exist.
 *
 * @param helperPath - The path to the helper file.
 * @param helperContents - The helper file contents.
 * @returns A boolean indicating whether the file was written.
 */
export async function ensureSyncHelperFile(
	helperPath: string,
	helperContents: string,
): Promise<boolean> {
	try {
		await readFile(helperPath, "utf8");
		return false;
	} catch {
		await mkdir(dirname(helperPath), { recursive: true });
		await writeFile(helperPath, helperContents, "utf8");
		return true;
	}
}

/**
 * Read and parse package.json from disk.
 *
 * @param packageJsonPath - The path to the package.json file.
 * @returns The parsed package manifest.
 */
async function readPackageJson(
	packageJsonPath: string,
): Promise<PackageJsonDocument> {
	const rawContents = await readFile(packageJsonPath, "utf8");
	return JSON.parse(rawContents) as PackageJsonDocument;
}

/**
 * Persist package.json with stable formatting.
 *
 * @param packageJsonPath - The file path to write.
 * @param packageJson - The package manifest to store.
 */
async function writePackageJson(
	packageJsonPath: string,
	packageJson: PackageJsonDocument,
): Promise<void> {
	const serialized = `${JSON.stringify(packageJson, null, "\t")}\n`;
	await writeFile(packageJsonPath, serialized, "utf8");
}

/**
 * Apply the synchronization script to a package manifest without overwriting existing scripts.
 *
 * @param packageJson - The current package manifest.
 * @param scriptName - The package script name to ensure.
 * @param scriptCommand - The command that the package script should execute.
 * @returns The next package manifest.
 */
function applySyncScript(
	packageJson: PackageJsonDocument,
	scriptName: string,
	scriptCommand: string,
): PackageJsonDocument {
	const currentScripts = packageJson.scripts ?? {};

	if (currentScripts[scriptName] === scriptCommand) {
		return packageJson;
	}

	if (currentScripts[scriptName] !== undefined) {
		return packageJson;
	}

	return {
		...packageJson,
		scripts: {
			...currentScripts,
			[scriptName]: scriptCommand,
		},
	};
}
