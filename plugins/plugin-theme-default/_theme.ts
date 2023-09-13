export const defaultTheme = {
	cytoscape: [
		/**
		 * Core
		 */
		{
			selector: '*',
			style: {
				'font-family': 'Work Sans',
			},
		},
		{
			selector: 'node[label]',
			style: {
				label: 'data(label)',
			},
		},
		{
			selector: 'node.qp-model',
			style: {
				shape: 'rectangle',
			},
		},
		{
			selector: 'edge[label]',
			style: {
				label: 'data(label)',
			},
		},
		{
			selector: 'edge.qp-link',
			style: {
				'line-color': '#333',
				'target-arrow-color': '#333',
			},
		},
		{
			selector: 'edge',
			style: {
				'curve-style': 'bezier',
				'target-arrow-shape': 'triangle',
			},
		},
		{
			selector: 'edge[label]',
			style: {
				label: 'data(label)',
				width: 3,
			},
		},

		/**
		 * Plugin: Edge Handles
		 */
		{
			selector: '.eh-handle',
			style: {
				'background-color': 'red',
				width: 12,
				height: 12,
				shape: 'ellipse',
				'overlay-opacity': 0,
				'border-width': 12, // makes the handle easier to hit
				'border-opacity': 0,
			},
		},
		{
			selector: '.eh-hover',
			style: {
				'background-color': 'red',
			},
		},
		{
			selector: '.eh-source',
			style: {
				'border-width': 2,
				'border-color': 'red',
			},
		},
		{
			selector: '.eh-target',
			style: {
				'border-width': 2,
				'border-color': 'red',
			},
		},
		{
			selector: '.eh-preview, .eh-ghost-edge',
			style: {
				'background-color': 'red',
				'line-color': 'red',
				'target-arrow-color': 'red',
				'source-arrow-color': 'red',
			},
		},
		{
			selector: '.eh-ghost-edge.eh-preview-active',
			style: {
				opacity: 0,
			},
		},
	],
}
