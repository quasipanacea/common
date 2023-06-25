declare module 'cytoscape-lasso'

declare module 'cytoscape' {
	interface Core {
		lassoSelectionEnabled(shouldEnable: boolean): void
	}
}
