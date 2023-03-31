interface CytoscapeCompoundDragAndDrop {
	disable(): void
	enable(): void
	destroy(): void
}

interface CytoscapeCompoundDragAndDropOptions {
	grabbedNode?: (unknown) => boolean
	dropTarget?: (unknown, unknown) => boolean
	dropSibling?: (unknown, unknown) => boolean
	newParentNode?: (unknown, unknown) => Record<string, unknown>
	boundingBoxOptions?: {
		includeOverlays?: number
		includeLabels?: number
	}
	overThreshold?: number
	outThreshold?: number
}

declare module 'cytoscape-compound-drag-and-drop' {
	export = unknown

	declare global {
		namespace cytoscape {
			interface Core {
				compoundDragAndDrop(
					CytoscapeCompoundDragAndDropOptions?,
				): CytoscapeCompoundDragAndDrop
			}
		}
	}
}
