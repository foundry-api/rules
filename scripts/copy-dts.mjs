import { cp, mkdir, readdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = dirname(scriptDirectory);
const sourceRoot = join(repositoryRoot, "src");
const targetRoot = join(repositoryRoot, "dist");

/**
 * Copy declaration files from the TypeScript source tree into the build output.
 *
 * @param {string} directory - Directory to scan recursively.
 * @returns {Promise<Array<string>>} The declaration files found under the directory.
 */
async function collectDeclarationFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const declarationFiles = [];

	for (const entry of entries) {
		const entryPath = join(directory, entry.name);

		if (entry.isDirectory()) {
			declarationFiles.push(...(await collectDeclarationFiles(entryPath)));
			continue;
		}

		if (entry.isFile() && entry.name.endsWith(".d.ts")) {
			declarationFiles.push(entryPath);
		}
	}

	return declarationFiles;
}

const declarationFiles = await collectDeclarationFiles(sourceRoot);

for (const declarationFile of declarationFiles) {
	const destinationFile = join(
		targetRoot,
		relative(sourceRoot, declarationFile),
	);
	await mkdir(dirname(destinationFile), { recursive: true });
	await cp(declarationFile, destinationFile);
}
