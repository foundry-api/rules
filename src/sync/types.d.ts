/**
 * A repository target that can receive synchronized rules, docs, and skills.
 *
 * @name SyncTarget
 */
export interface SyncTarget {
	/**
	 * The absolute filesystem path of the target repository.
	 */
	readonly repositoryPath: string;

	/**
	 * An optional stable name for the target repository.
	 */
	readonly repositoryName?: string;
}

/**
 * Options for synchronizing the rules repository into a single target.
 *
 * @name SyncRepositoryOptions
 */
export interface SyncRepositoryOptions {
	/**
	 * The absolute filesystem path to the rules repository that acts as the source of truth.
	 */
	readonly sourceRepositoryPath?: string;

	/**
	 * The absolute filesystem path of the repository to update.
	 */
	readonly targetRepositoryPath: string;

	/**
	 * The UTC timestamp to stamp into generated headers.
	 */
	readonly generatedAtUtc?: string;
}

/**
 * Options for synchronizing the rules repository into multiple targets.
 *
 * @name SyncWorkspaceOptions
 */
export interface SyncWorkspaceOptions {
	/**
	 * The absolute filesystem path to the rules repository that acts as the source of truth.
	 */
	readonly sourceRepositoryPath?: string;

	/**
	 * The UTC timestamp to stamp into generated headers.
	 */
	readonly generatedAtUtc?: string;

	/**
	 * The repositories to update.
	 */
	readonly targets: readonly SyncTarget[];
}

/**
 * A result entry for one synchronized repository.
 *
 * @name SyncRepositoryResult
 */
export interface SyncRepositoryResult {
	/**
	 * The target repository that was updated.
	 */
	readonly repositoryPath: string;

	/**
	 * The files written during the synchronization run.
	 */
	readonly writtenFiles: readonly string[];
}

/**
 * The aggregate result for a multi-repository synchronization run.
 *
 * @name SyncWorkspaceResult
 */
export interface SyncWorkspaceResult {
	/**
	 * The per-repository synchronization results.
	 */
	readonly repositories: readonly SyncRepositoryResult[];
}

/**
 * A parsed markdown section bounded by a heading.
 *
 * @name MarkdownSection
 */
export interface MarkdownSection {
	/**
	 * The heading line, for example `## Rules`.
	 */
	readonly heading: string;

	/**
	 * The body content under the heading, without the heading line itself.
	 */
	readonly body: string;
}

/**
 * A synchronous snapshot of a file path and its contents.
 *
 * @name SyncFileSnapshot
 */
export interface SyncFileSnapshot {
	/**
	 * The absolute path of the file.
	 */
	readonly filePath: string;

	/**
	 * The raw text content loaded from disk.
	 */
	readonly contents: string;
}
