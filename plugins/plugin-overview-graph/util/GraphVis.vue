<template>
	<div ref="graphEl" style="height: 700px"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as vis from 'vis-data'
import * as visNetwork from 'vis-network'
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
const throttledAdjustHeight = _.throttle(adjustHeight, 100)
function adjustHeight() {
	const outer = document.querySelector('.hack-unique-graph-wrapper')
	if (graphEl.value) {
		graphEl.value.attributeStyleMap.set(
			'height',
			CSS.px(
				(outer?.getBoundingClientRect().height ?? globalThis.innerHeight) - 43,
			),
		)
	}
}
onMounted(() => {
	adjustHeight()
	window.addEventListener('resize', throttledAdjustHeight)
})
onUnmounted(() => {
	window.removeEventListener('resize', throttledAdjustHeight)
})

let network: visNetwork.Network
onMounted(async () => {
	const options = {
		autoResize: true,
		height: '100%',
		width: '100%',
		locale: 'en',
	}
	network = new visNetwork.Network(graphEl.value, {}, options)
	network.on('beforeDrawing', function (ctx) {
		var nodeId = 1
		var nodePosition = network.getPositions([nodeId])
		if (!nodePosition) return
		ctx.strokeStyle = '#A6D5F7'
		ctx.fillStyle = '#294475'

		ctx.beginPath()
		ctx.arc(
			nodePosition[nodeId].x,
			nodePosition[nodeId].y,
			50,
			0,
			2 * Math.PI,
			false,
		)
		ctx.closePath()

		ctx.fill()
		ctx.stroke()
	})
	network.on('afterDrawing', function (ctx) {
		var nodeId = 1
		var nodePosition = network.getPositions([nodeId])
		if (!nodePosition) return
		ctx.strokeStyle = '#294475'
		ctx.lineWidth = 4
		ctx.fillStyle = '#A6D5F7'

		ctx.beginPath()
		ctx.arc(
			nodePosition[nodeId].x,
			nodePosition[nodeId].y,
			20,
			0,
			2 * Math.PI,
			false,
		)
		ctx.closePath()

		ctx.fill()
		ctx.stroke()
	})
	await updateData()
})

async function updateData() {
	if (!network) throw new Error('network is undefined')
	let nodes: visNetwork.Node[] = []
	let edges: visNetwork.Edge[] = []

	nodes.push({
		id: 1,
		label: 'Node 1',
	})
	// const nodes = new vis.DataSet([
	// 	{ id: 1, label: 'Node 1' },
	// 	{ id: 2, label: 'Node 2' },
	// 	{ id: 3, label: 'Node 3' },
	// 	{ id: 4, label: 'Node 4' },
	// 	{ id: 5, label: 'Node 5' },
	// ])

	// // create an array with edges
	// const edges = new vis.DataSet([
	// 	{ from: 1, to: 3 },
	// 	{ from: 1, to: 2 },
	// 	{ from: 2, to: 4 },
	// 	{ from: 2, to: 5 },
	// 	{ from: 3, to: 3 },
	// ])

	// models
	const { models } = await api.core.modelList.query()
	for (const model of models) {
		nodes.push({
			label: model.name,
		})
	}

	network.setData({ nodes, edges })
}
</script>
