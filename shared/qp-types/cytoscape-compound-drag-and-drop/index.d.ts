interface CytoscapeCompoundDragAndDropController {
	/**
	 * Disables the UI
	 */
	disable(): void

	/**
	 * Re-enables the UI
	 */
	enable(): void

	/**
	 * Removes the UI
	 */
	destroy(): void
}

interface CytoscapeCompoundDragAndDropOptions {
	/**
	 * Filter function to specify which nodes are valid to grab and drop into other nodes
	 */
	grabbedNode?: (unknown) => boolean

	/**
	 * Filter function to specify which parent nodes are valid drop targets
	 */
	dropTarget?: (unknown, unknown) => boolean

	/**
	 * Filter function to specify which orphan nodes are valid drop siblings
	 */
	dropSibling?: (unknown, unknown) => boolean

	/**
	 * Specifies element json for parent nodes added by dropping an orphan node on another orphan (a drop sibling). You can chose to return the dropSibling in which case it becomes the parent node and will be preserved after all its children are removed.
	 */
	newParentNode?: (unknown, unknown) => Record<string, unknown>

	/**
	 * Same as https://js.cytoscape.org/#eles.boundingBox, used when calculating if one node is dragged over another
	 */
	boundingBoxOptions?: {
		includeOverlays?: number
		includeLabels?: number
	}

	/**
	 * Make dragging over a drop target easier by expanding the hit area by this amount on all sides
	 */
	overThreshold?: number

	/**
	 * Make dragging out of a drop target a bit harder by expanding the hit area by this amount on all sides
	 */
	outThreshold?: number
}

declare module 'cytoscape-compound-drag-and-drop'

declare module 'cytoscape' {
	interface Core {
		compoundDragAndDrop(
			CytoscapeCompoundDragAndDropOptions?,
		): CytoscapeCompoundDragAndDropController
	}
}
