import {
	LOCAL_SCOPE_HEADING,
	RULES_SECTION_HEADING,
	SKILLS_SECTION_HEADING,
	SYNCED_RULES_HEADING,
} from "./constants";
import type { MarkdownSection } from "./types";

/**
 * Extract a markdown section body from a document.
 *
 * @param markdown - The markdown document to inspect.
 * @param heading - The heading to extract.
 * @returns The extracted markdown section.
 * @throws {Error} Throws when the heading is not present in the document.
 * @example
 * ```ts
 * const section = extractMarkdownSection("# Title\n\n## Rules\n\n- One\n\n## Skills\n");
 * ```
 */
export function extractMarkdownSection(
	markdown: string,
	heading: string,
): MarkdownSection {
	const section = findMarkdownSectionBounds(markdown, heading);

	return {
		heading,
		body: markdown.slice(section.bodyStartIndex, section.endIndex).trim(),
	};
}

/**
 * Replace the content of a markdown section while preserving the rest of the document.
 *
 * @param markdown - The markdown document to transform.
 * @param heading - The heading whose body must be replaced.
 * @param replacementBody - The new body content for the section.
 * @returns The transformed markdown document.
 * @throws {Error} Throws when the requested heading cannot be found.
 * @example
 * ```ts
 * const next = replaceMarkdownSection("# Title\n\n## Rules\n\n- Old\n\n## Skills\n", "## Rules", "- New");
 * ```
 */
export function replaceMarkdownSection(
	markdown: string,
	heading: string,
	replacementBody: string,
): string {
	const section = findMarkdownSectionBounds(markdown, heading);
	const replacement = `${heading}\n\n${replacementBody.trim()}`;

	return [
		markdown.slice(0, section.headingStartIndex),
		replacement,
		markdown.slice(section.endIndex),
	].join("");
}

/**
 * Render the synchronized README rule indexes from a canonical source README.
 *
 * @param sourceReadme - The canonical README from the rules repository.
 * @param targetReadme - The README to update in a downstream repository.
 * @returns The README with the rules and skills sections replaced.
 * @example
 * ```ts
 * const next = renderSynchronizedReadme(sourceReadme, targetReadme);
 * ```
 */
export function renderSynchronizedReadme(
	sourceReadme: string,
	targetReadme: string,
): string {
	const rulesSection = extractMarkdownSection(
		sourceReadme,
		RULES_SECTION_HEADING,
	);
	const skillsSection = extractMarkdownSection(
		sourceReadme,
		SKILLS_SECTION_HEADING,
	);

	const withRules = replaceMarkdownSection(
		targetReadme,
		RULES_SECTION_HEADING,
		rulesSection.body,
	);
	return replaceMarkdownSection(
		withRules,
		SKILLS_SECTION_HEADING,
		skillsSection.body,
	);
}

/**
 * Render a downstream AGENTS document by preserving local scope and copying the synchronized rules.
 *
 * @param sourceAgents - The canonical AGENTS file from the rules repository.
 * @param targetAgents - The existing AGENTS file from the downstream repository.
 * @param sourceRepositoryPath - The source repository path to stamp into the generated header.
 * @param generatedAtUtc - The UTC timestamp to stamp into the generated header.
 * @returns The rendered AGENTS document.
 * @throws {Error} Throws when the expected AGENTS sections are missing.
 * @example
 * ```ts
 * const next = renderSynchronizedAgents(sourceAgents, targetAgents, "/path/to/rules", "2026-07-01T16:12:23Z");
 * ```
 */
export function renderSynchronizedAgents(
	sourceAgents: string,
	targetAgents: string,
	sourceRepositoryPath: string,
	generatedAtUtc: string,
): string {
	const localScope = extractMarkdownSection(
		targetAgents,
		LOCAL_SCOPE_HEADING,
	).body;
	const syncedRules = extractMarkdownSection(
		sourceAgents,
		SYNCED_RULES_HEADING,
	).body;

	return [
		`<!-- AUTO-GENERATED FROM: ${sourceRepositoryPath} -->`,
		`<!-- GENERATED_AT_UTC: ${generatedAtUtc} -->`,
		"<!-- DO NOT EDIT THE SYNCED SECTIONS MANUALLY -->",
		"",
		"# AGENTS",
		"",
		"Use the `backend-foundations` skill from `skills/backend-foundations/SKILL.md` before editing this repository.",
		"",
		"## Local Scope",
		"",
		localScope,
		"",
		"## Synced Global Rules",
		"",
		syncedRules,
		"",
	].join("\n");
}

/**
 * Find the index of the next markdown heading after a given position.
 *
 * @param markdown - The markdown document to inspect.
 * @param fromIndex - The starting index for the scan.
 * @returns The index of the next heading or the end of the document.
 */
function findNextHeadingIndex(markdown: string, fromIndex: number): number {
	const headingPattern = /\n##\s+/g;
	headingPattern.lastIndex = fromIndex;
	const match = headingPattern.exec(markdown);
	return match?.index ?? markdown.length;
}

/**
 * Locate a markdown section and its body bounds.
 *
 * @param markdown - The markdown document to inspect.
 * @param heading - The heading to locate.
 * @returns The heading and body boundaries.
 * @throws {Error} Throws when the heading is not present in the document.
 */
function findMarkdownSectionBounds(
	markdown: string,
	heading: string,
): {
	readonly bodyStartIndex: number;
	readonly endIndex: number;
	readonly headingStartIndex: number;
} {
	const headingIndex = markdown.indexOf(`${heading}\n`);

	if (headingIndex < 0) {
		throw new Error(`Could not find markdown heading: ${heading}`);
	}

	const bodyStartIndex = headingIndex + heading.length + 1;
	const endIndex = findNextHeadingIndex(markdown, bodyStartIndex);

	return {
		bodyStartIndex,
		endIndex,
		headingStartIndex: headingIndex,
	};
}
