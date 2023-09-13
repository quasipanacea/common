<template>
	<div ref="graphEl" style="height: 700px"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import G6 from '@antv/g6'
import * as _ from 'lodash'

import { t } from '@quasipanacea/common/index.ts'
import {
	pluginClient,
	popup,
	trpcClient,
	type BareAppRouter,
} from '@quasipanacea/common/client/index.js'
const api = trpcClient.yieldClient<BareAppRouter>()

const graphEl = ref<HTMLElement>()
let graph: InstanceType<typeof G6.Graph>
onMounted(async () => {
	const menu = new G6.Menu()

	graph = new G6.Graph({
		container: graphEl.value,
		width:
			document.querySelector('.hack-unique-graph-wrapper')?.clientWidth ??
			window.innerWidth,
		height:
			document.querySelector('.hack-unique-graph-wrapper')?.clientHeight - 143, // TODO
		layout: {
			type: 'force',
			preventOverlap: true,
		},
		modes: {
			default: ['drag-canvas'],
		},
		plugins: [menu],
	})
	graph.on('node:dragstart', (ev) => {
		graph.layout()
		refreshDragedNodePosition(ev)
	})
	graph.on('node:drag', (ev) => {
		const forceLayout = graph.get('layoutController').layoutMethods[0]
		forceLayout.execute()
		refreshDragedNodePosition(ev)
	})
	graph.on('node:dragend', (ev) => {
		ev.item.get('model').fx = null
		ev.item.get('model').fy = null
	})
	await updateData()
})

async function updateData() {
	if (!graphEl) throw new Error('network is undefined')
	let nodes: unknown[] = []
	let edges: unknown[] = []

	// const data = {
	// 	// The array of nodes
	// 	nodes: [
	// 		{
	// 			id: 'node1',
	// 			x: 100,
	// 			y: 200,
	// 		},
	// 		{
	// 			id: 'node2',
	// 			x: 300,
	// 			y: 200,
	// 		},
	// 	],
	// 	// The array of edges
	// 	edges: [
	// 		// It is an edge link node1 to node2
	// 		{
	// 			source: 'node1',
	// 			target: 'node2',
	// 		},
	// 	],
	// }

	const { models } = await api.core.modelList.query()
	for (const model of models) {
		nodes.push({
			label: model.name,
		})
	}

	// Load data
	graph.data({ nodes, edges })
	// Render the graph
	graph.render()
}
function refreshDragedNodePosition(e) {
	const model = e.item.get('model')
	model.fx = e.x
	model.fy = e.y
}
</script>
