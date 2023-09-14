<template>
	<div class="m-2">
		<button class="button is-primary" @click="newModel">New Model</button>
		<div ref="gridEl" class="grid">
			<div v-for="[uuid, model] in models" class="item" :data-id="uuid">
				<div class="item-content">
					<RouterLink :to="'/model/' + uuid">
						<h2 style="display: inline">{{ model.model.name }}</h2>
					</RouterLink>
					<br />
					<span>{{ model.model.format }}</span>
					<ul>
						<li v-for="pod of model.pods">
							<RouterLink style="font-size: 14px" :to="'/pod/' + pod.uuid">{{
								pod.name
							}}</RouterLink>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import * as _ from 'lodash'
import Muuri from 'muuri'

import { t } from '@quasipanacea/common/index.ts'
import {
	pluginClient,
	popup,
	trpcClient,
	utilClient,
	type BareAppRouter,
} from '@quasipanacea/common/client/index.js'
import {
	ModelCreateLightPopup,
	ModelCreatePopupDefault,
} from '@quasipanacea/common/components/index.js'
const api = trpcClient.yieldClient<BareAppRouter>()

const gridEl = ref<HTMLElement>()
const models = ref(
	new Map<
		string,
		{
			model: any
			pods: any
		}
	>(),
)
onMounted(async () => {
	if (!gridEl.value) {
		throw new Error('gridEl not defined')
	}

	const data = await api.core.modelList.query()
	const fullData = await Promise.all(
		data.models.map((model) => {
			return api.core.podList.query({ model: { uuid: model.uuid } })
		}),
	)
	for (let i = 0; i < fullData.length; ++i) {
		const model = data.models[i]
		const { pods } = fullData[i]
		models.value.set(model.uuid, {
			model: model,
			pods,
		})
	}

	nextTick(() => {
		const grid = new Muuri(gridEl.value, {
			dragEnabled: true,
		})
		grid.on('move', () => {
			saveLayout(grid)
		})

		const layout = globalThis.localStorage.getItem('layout')
		// if (layout) {
		// 	loadLayout(grid, layout)
		// } else {
		// 	grid.layout(true)
		// }
	})
})

function serializeLayout(grid: Muuri) {
	const itemIds = grid.getItems().map((item) => {
		return item.getElement()?.getAttribute('data-id')
	})

	return JSON.stringify(itemIds)
}

function saveLayout(grid: Muuri) {
	const layout = serializeLayout(grid)
	globalThis.localStorage.setItem('layout', layout)
}

function loadLayout(grid: Muuri, serializedLayout: string) {
	const layout = JSON.parse(serializedLayout)
	const currentItems = grid.getItems()
	const currentItemIds = currentItems.map((item) => {
		return item.getElement()?.getAttribute('data-id')
	})

	var newItems = []
	var itemId
	var itemIndex

	for (let i = 0; i < layout.length; ++i) {
		itemId = layout[i]
		itemIndex = currentItemIds.indexOf(itemId)
		if (itemIndex > -1) {
			newItems.push(currentItems[itemIndex])
		}
	}

	grid.sort(newItems, { layout: 'instant' })
}

async function newModel() {
	const res = (
		await popup.showNoData('model-create-light', ModelCreateLightPopup)
	).response

	const pluginId = await utilClient.getPluginFromFormat(
		api,
		res.format,
		'model',
	)
	const plugin = pluginClient.get(pluginId)

	const res2 = (
		await popup.show(
			'model-create-custom',
			plugin.componentCreatePopup || ModelCreatePopupDefault,
			{ pluginId },
		)
	).response

	await api.core.modelAdd.mutate({
		format: res.format,
		name: res2.name,
	})
}
</script>

<style scoped>
.grid {
	position: relative;
}

.item {
	display: block;
	position: absolute;
	min-width: 100px;
	/* height: 100px; */
	margin: 6px 6px 0 0;
	padding: 6px;
	z-index: 1;
	font-weight: bold;
	background: #000;
	color: #fff;
	border-radius: 5px;
}
.item.muuri-item-dragging {
	z-index: 3;
}
.item.muuri-item-releasing {
	z-index: 2;
}
.item.muuri-item-hidden {
	z-index: 0;
}
.item-content {
	position: relative;
	width: 100%;
	height: 100%;
}
</style>
