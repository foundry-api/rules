/**
 * Generate the repository-local sync helper used by the package script.
 *
 * @returns The CommonJS helper contents.
 */
export function renderSyncHelper(): string {
	return [
		'"use strict";',
		"",
		'const { syncRulesToRepository } = require("@foundry-api/rules");',
		"",
		"syncRulesToRepository({",
		"  targetRepositoryPath: process.cwd(),",
		"  generatedAtUtc: new Date().toISOString(),",
		"})",
		"  .then((result) => {",
		"    console.log(JSON.stringify(result, null, 2));",
		"  })",
		"  .catch((error) => {",
		"    console.error(error);",
		"    process.exit(1);",
		"  });",
		"",
	].join("\n");
}
