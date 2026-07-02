/**
 * Render a minimal changelog skeleton for a repository that does not yet have one.
 *
 * @param generatedAtUtc - The UTC timestamp for the sync run.
 * @param sourceRepositoryPath - The source repository path used for the sync.
 * @returns The changelog contents.
 */
export function renderChangelogSkeleton(generatedAtUtc: string, sourceRepositoryPath: string): string {
  return [
    "# Changelog",
    "",
    "## Unreleased",
    "",
    `- Synchronized from ${sourceRepositoryPath} at ${generatedAtUtc}.`,
    "",
  ].join("\n");
}
