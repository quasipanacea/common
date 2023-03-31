declare module 'cytoscape-edgehandles' {
	export = unknown

	declare global {
		namespace cytoscape {
			interface Core {
				edgehandles(options: {
					canConnect: (sourceNode: any, targetNode: any) => bool
					edgeParams: (sourceNode: any, targetNode: any) => any
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
				}): void
			}
		}
	}
}
