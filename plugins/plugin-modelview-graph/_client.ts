import type cytoscape from 'cytoscape'

import { t } from '@quasipanacea/common/index.ts'
import { pluginClient } from '@quasipanacea/common/client/index.js'

import { metadata } from './_isomorphic.ts'
import { default as component } from './ModelviewGraph.vue'

export async function init() {
	pluginClient.register({
		metadata,
		component,
		arrangeElements,
	})
}

function arrangeElements(
	model: t.Model_t,
	pods: t.Pod_t[],
): { elements: cytoscape.ElementDefinition[] } {
	const elements: cytoscape.ElementDefinition[] = []

	// pods
	for (const pod of pods) {
		elements.push({
			group: 'nodes',
			...{
				position: pod?.extra?.position && {
					x: pod.extra.position.x,
					y: pod.extra.position.y,
				},
			},
			data: {
				id: pod.uuid,
				label: pod.name,
				resource: 'pod',
				resourceData: pod,
			},
		})

		elements.push({
			group: 'edges',
			classes: 'qp-link',
			data: {
				id: crypto.randomUUID(),
				source: pod.uuid,
				target: pod.model.uuid,
			},
		})
	}

	return { elements }
}

function validateNewChild() {}
