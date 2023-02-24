<template>
	<div class="graph" style="height: 100%"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { Network } from 'vis-network'
import { DataSet } from 'vis-data'

import { api } from '@/util/api'

export default defineComponent({
	setup() {
		onMounted(() => {
			const f = api.collectionList.query()
			const nodes = new DataSet([
				{ id: 1, label: 'Essay 1' },
				{ id: 2, label: 'Essay 2' },
				{ id: 3, label: 'Essay 3' },
				{ id: 4, label: 'Essay 4' },
				{ id: 5, label: 'Essay 5' },
				{ id: 6, label: 'Review 1' },
				{ id: 7, label: 'Review 2' },
				{ id: 8, label: 'Review 3' },
				{ id: 9, label: 'Review 4' },
				{ id: 10, label: 'NEW' },
				{ id: 11, label: 'NEW' },
			])

			// create an array with edges
			const edges = new DataSet([
				{ from: 1, to: 2 },
				{ from: 2, to: 3 },
				{ from: 3, to: 4 },
				{ from: 4, to: 5 },
				{ from: 5, to: 11 },

				{ from: 6, to: 7 },
				{ from: 7, to: 8 },
				{ from: 8, to: 9 },
				{ from: 9, to: 10 },
			])

			// create a network
			const container: HTMLElement | null = document.querySelector('.graph')
			if (!container) {
				throw new Error('container is not truthy')
			}

			const data = {
				nodes: nodes,
				edges: edges,
			}
			const options = {}
			const network = new Network(container, data, options)

			network.on('selectNode', (params) => {
				if (network.isCluster(params.nodes[0])) {
					network.openCluster(params.nodes[0])
				}
			})
			network.cluster({
				joinCondition(node) {
					return node.label === 'Node 1' || node.label === 'Node 2'
				},
				clusterNodeProperties: {
					borderWidth: 3,
					shape: 'database',
				},
			})
		})

		return {}
	},
})
</script>
