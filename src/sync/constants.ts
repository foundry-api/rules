/**
 * Canonical file and heading constants used by the synchronization engine.
 *
 * @name sync/constants
 */

/**
 * The repository-relative path for the shared backend foundations skill.
 *
 * @constant
 */
export const BACKEND_FOUNDATIONS_SKILL_PATH = "skills/backend-foundations/SKILL.md";

/**
 * The repository-relative path for the generated AGENTS file.
 *
 * @constant
 */
export const AGENTS_FILE_NAME = "AGENTS.md";

/**
 * The repository-relative path for the contribution guide.
 *
 * @constant
 */
export const CONTRIBUTING_FILE_NAME = "CONTRIBUTING.md";

/**
 * The repository-relative path for changelog files.
 *
 * @constant
 */
export const CHANGELOG_FILE_NAME = "CHANGELOG.md";

/**
 * The repository-relative path for the rules index README.
 *
 * @constant
 */
export const README_FILE_NAME = "README.md";

/**
 * The repository-relative path for the rules documentation directory.
 *
 * @constant
 */
export const DOCUMENTATION_DIRECTORY_NAME = "docs";

/**
 * The repository-relative path for the shared skill directory.
 *
 * @constant
 */
export const SKILLS_DIRECTORY_NAME = "skills";

/**
 * The repository-relative path for the canonical rules repository README section.
 *
 * @constant
 */
export const RULES_SECTION_HEADING = "## Rules";

/**
 * The repository-relative path for the canonical skills section.
 *
 * @constant
 */
export const SKILLS_SECTION_HEADING = "## Skills";

/**
 * The repository-relative path for the local scope section in AGENTS.md.
 *
 * @constant
 */
export const LOCAL_SCOPE_HEADING = "## Local Scope";

/**
 * The repository-relative path for the synced rules section in AGENTS.md.
 *
 * @constant
 */
export const SYNCED_RULES_HEADING = "## Synced Global Rules";

/**
 * The canonical package script name used to run repository synchronization.
 *
 * @constant
 */
export const SYNC_RULES_SCRIPT_NAME = "sync:rules";

/**
 * The relative path of the generated helper used by the sync script.
 *
 * @constant
 */
export const SYNC_RULES_SCRIPT_PATH = "scripts/sync-rules.cjs";
