declare module 'cytoscape-lasso' {
	export = unknown

	declare global {
		namespace cytoscape {
			interface Core {
				lassoSelectionEnabled(boolean): void
			}
		}
	}
}
