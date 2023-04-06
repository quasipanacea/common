interface CytoscapeEdgeHandlesOptions {
	/**
	 * Whether an edge can be created between source and target
	 */
	canConnect: (sourceNode: unknown, targetNode: unknown) => boolean
	/**
	 * For edges between the specified source and target
	 * Return element object to be passed to cy.add() for edge
	 */
	edgeParams: (sourceNode: unknown, targetNode: unknown) => unknown
	/**
	 * Time spent hovering over a target node before it is considered selected.
	 */
	hoverDelay: number
	/**
	 * When enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs).
	 */
	snap: boolean
	/**
	 * The target node must be less than or equal to this many pixels away from the cursor/finger.
	 */
	snapThreshold: number
	/**
	 * The number of times per second (Hz) that snap checks done (lower is less expensive).
	 */
	snapFrequency: number
	/**
	 * Set events:no to edges during draws, prevents mouseouts on compounds.
	 */
	noEdgeEventsInDraw: boolean
	/**
	 * During an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom.
	 */
	disableBrowserGestures: boolean
}

interface CytoscapeEdgeHandlesController {
	/**
	 * Manually start the gesture (as if the handle were already held)
	 */
	start(sourceNode: unknown): void

	/**
	 * Manually completes or cancels the gesture
	 */
	stop(): void

	/**
	 * Disables edgehandles behaviour
	 */
	disable(): void

	/**
	 * Enables edgehandles behaviour
	 */
	enable(): void

	/**
	 * Turn on draw mode (the entire node body acts like the handle)
	 */
	enableDrawMode(): void

	/**
	 * Turn off draw mode
	 */
	disableDrawMode(): void

	/**
	 * Remove edgehandles behaviour
	 */
	destroy()
}

declare module 'cytoscape-edgehandles'

declare module 'cytoscape' {
	interface ExtensionEventMap {
		/**
		 * When the edge creation gesture starts
		 */
		ehstart: (event: unknown, sourceNode: unknown) => void

		/**
		 * When the edge is created
		 */
		ehcomplete: (
			event: string,
			sourceNode: unknown,
			targetNode: unknown,
			addedEdge: unknown,
		) => void

		/**
		 * When the edge creation gesture is stopped (either successfully completed or cancelled)
		 */
		ehstop: (event: unknown, sourceNode: unknown) => void

		/**
		 * When the edge creation gesture is cancelled
		 */
		ehcancel: (
			event: unknown,
			sourceNode: unknown,
			cancelledTargets: unknown,
		) => void

		/**
		 * When hovering over a target
		 */
		ehhoverover: (
			event: unknown,
			sourceNode: unknown,
			targetNode: unknown,
		) => void

		/**
		 * When leaving a target node
		 */
		ehhoverout: (
			event: unknown,
			sourceNode: unknown,
			targetNode: unknown,
		) => void

		/**
		 * When a preview is shown
		 */
		ehpreviewon: (
			event: unknown,
			sourceNode: unknown,
			targetNode: unknown,
			previewEdge: unknown,
		) => void

		/**
		 * When the preview is removed
		 */
		ehpreviewoff: (
			event: unknown,
			sourceNode: unknown,
			targetNode: unknown,
			previewEdge: unknown,
		) => void

		/**
		 * When draw mode is enabled
		 */
		ehdrawon: () => void

		/**
		 * When draw mode is disabled
		 */
		ehdrawoff: () => void
	}

	interface Core {
		edgehandles(
			options: CytoscapeEdgeHandlesOptions,
		): CytoscapeEdgeHandlesController
	}
}
