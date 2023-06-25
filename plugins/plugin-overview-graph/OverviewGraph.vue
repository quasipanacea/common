<template>
	<div ref="cytoscapeEl" style="height: 100%"></div>
	<div style="position: absolute; top: 0; right: 0">
		<span class="button" style="margin: 5px">
			{{
				currentMode === 'default'
					? 'Node Move'
					: currentMode === 'shift'
					? 'Draw Connection'
					: currentMode === 'control'
					? 'Node Add/Remove'
					: 'Node Move'
			}}
		</span>

		<div class="dropdown is-right is-hoverable" style="margin: 5px">
			<div class="dropdown-trigger">
				<button
					class="button"
					aria-haspopup="true"
					aria-controls="dropdown-menu"
				>
					<span>Options</span>
					<span class="icon">
						<ion-icon name="chevron-down-outline"></ion-icon>
					</span>
				</button>
			</div>
			<div class="dropdown-menu" id="dropdown-menu" role="menu">
				<div class="dropdown-content">
					<a
						class="dropdown-item"
						@click="popup.showNoData('null', GuidePopup)"
					>
						Show Guide
					</a>
					<router-link to="/plugins">
						<a class="dropdown-item">Plugins</a>
					</router-link>
					<div class="dropdown-item">
						<div class="select">
							<select v-model="currentLayout">
								<option value="automatic">Automatic Layout</option>
								<option value="manual">Manual Layout</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import cytoscape from 'cytoscape'
import cytoscapeCola from 'cytoscape-cola'
import cytoscapeFcose from 'cytoscape-fcose'
import cytoscapeLasso from 'cytoscape-lasso'
import cytoscapeCtxMenu from 'cytoscape-cxtmenu'
import cytoscapeUndoRedo from 'cytoscape-undo-redo'
import cytoscapeEdgehandles from 'cytoscape-edgehandles'
import cytoscapeCompoundDragAndDrop from 'cytoscape-compound-drag-and-drop'

import { t } from '@quasipanacea/common/index.ts'
import {
	plugin,
	popup,
	trpcClient,
	type BareAppRouter,
} from '@quasipanacea/common/client/index.js'

import { defaultTheme } from '@quasipanacea/plugin-theme-default/_theme'
import {
	ModelCreateChildPopup,
	ModelCreatePopup,
	ModelEditPropertiesPopup,
	PodCreatePopup,
} from '@quasipanacea/common/components/index.js'
import GuidePopup from './util/GuidePopup.vue'

const router = useRouter()
const api = trpcClient.yieldClient<BareAppRouter>()

let cy: cytoscape.Core | null = null
let cytoscapeEl = ref<HTMLElement>()
let cyEdgeHandle: CytoscapeEdgeHandlesController | null = null
let cyDND: CytoscapeCompoundDragAndDropController | null = null

const currentMode = ref<'default' | 'shift' | 'control'>('default')

const currentLayout = ref<'manual' | 'automatic'>('manual')
watch(currentLayout, (val) => {
	if (!cy) throw new Error('cy is undefined')

	if (val === 'manual') {
		cy.layout({
			name: 'preset',
			animate: true,
		}).run()
	} else if (val === 'automatic') {
		cy.layout({
			name: 'cola',
			animate: true,
		}).run()
	}
})

const cyLayout: cytoscape.LayoutOptions = {
	name: 'preset',
	animate: true,
}

function keydownFn(ev: KeyboardEvent) {
	if (!cyEdgeHandle) throw new Error('cyEdgeHandle is undefined')
	if (!cyDND) throw new Error('cyDND is undefined')

	if (ev.shiftKey) {
		cyEdgeHandle.enableDrawMode()
		cyEdgeHandle.enable()
		currentMode.value = 'shift'
	} else if (ev.ctrlKey) {
		cyDND.enable()
		currentMode.value = 'control'
	}
}
function keyupFn(ev: KeyboardEvent) {
	if (!cyEdgeHandle) throw new Error('cyEdgeHandle is undefined')
	if (!cyDND) throw new Error('cyDND is undefined')

	if (ev.key === 'Shift') {
		cyEdgeHandle.disableDrawMode()
		cyEdgeHandle.disable()
	} else if (ev.key === 'Control') {
		cyDND.disable()
	}
	currentMode.value = 'default'
}
onMounted(() => {
	document.addEventListener('keydown', keydownFn)
	document.addEventListener('keyup', keyupFn)
})
onUnmounted(() => {
	document.removeEventListener('keydown', keydownFn)
	document.removeEventListener('keyup', keyupFn)
})

onMounted(async () => {
	if (!cytoscapeEl.value) throw new Error('cytoscape container not defined')

	cy = cytoscape({
		container: cytoscapeEl.value,
		style: defaultTheme.cytoscape,
		minZoom: 0.5,
		maxZoom: 3,
		boxSelectionEnabled: false,
	})

	cy.on('dragfree', async (ev) => {
		const elJson = ev.target.json() as t.CytoscapeElementJson
		const elData = ev.target.data() as t.CytoscapeElementData

		if (currentLayout.value === 'manual') {
			if (elData.resource === 'orb') {
				await api.core.orbModify.mutate({
					uuid: elData.resourceData.uuid,
					data: {
						extra: {
							position: {
								x: elJson.position.x,
								y: elJson.position.y,
							},
						},
					},
				})
			} else if (elData.resource === 'pod') {
				await api.core.podModify.mutate({
					uuid: elData.resourceData.uuid,
					data: {
						extra: {
							position: {
								x: elJson.position.x,
								y: elJson.position.y,
							},
						},
					},
				})
			} else if (elData.resource === 'model') {
				await api.core.modelModify.mutate({
					uuid: elData.resourceData.uuid,
					data: {
						extra: {
							position: {
								x: elJson.position.x,
								y: elJson.position.y,
							},
						},
					},
				})
			}
		}
	})

	{
		// Check before '.use()' to prevent spurious warnings on hot-reload
		if (!Object.getPrototypeOf(cy)['cxtmenu']) {
			cytoscape.use(cytoscapeCtxMenu)
		}
		if (!Object.getPrototypeOf(cy)['undoRedo']) {
			cytoscape.use(cytoscapeUndoRedo)
		}
		if (!Object.getPrototypeOf(cy)['edgehandles']) {
			cytoscape.use(cytoscapeEdgehandles)
		}
		if (!Object.getPrototypeOf(cy)['compoundDragAndDrop']) {
			cytoscape.use(cytoscapeCompoundDragAndDrop)
		}
		if (!Object.getPrototypeOf(cy)['lassoSelectionEnabled']) {
			cytoscape.use(cytoscapeLasso)
		}
		if (true) {
			cytoscape.use(cytoscapeFcose)
		}
		if (true) {
			cytoscape.use(cytoscapeCola)
		}

		cyDND = cy.compoundDragAndDrop()
		cyDND.disable()

		cy.lassoSelectionEnabled(false)

		// edge handle
		cyEdgeHandle = cy.edgehandles({
			canConnect(sourceNode, targetNode) {
				// whether an edge can be created between source and target
				return !sourceNode.same(targetNode) // e.g. disallow loops
			},
			edgeParams(sourceNode, targetNode) {
				// for edges between the specified source and target
				// return element object to be passed to cy.add() for edge
				return {}
			},
			hoverDelay: 150,
			snap: false,
			snapThreshold: 50,
			snapFrequency: 15,
			noEdgeEventsInDraw: true,
			disableBrowserGestures: true,
		})
		cy.on('ehcomplete', async (event, sourceNode, targetNode, addedEdge) => {
			const edge = addedEdge.json() as t.CytoscapeElementJson

			await api.core.linkAdd.mutate({})

			await updateData()
		})

		// context menu
		const ctxMenuDefaults = {
			openMenuEvents: 'cxttapstart',
		}
		cy.cxtmenu({
			selector: 'node',
			...ctxMenuDefaults,
			commands(el) {
				const elData = el.data() as t.CytoscapeElementData

				if (elData.resource === 'orb') {
					return [
						{
							content: 'Delete Orb',
							async select(el) {
								const data = el.data() as t.CytoscapeElementData

								if (globalThis.confirm('Are you sure?')) {
									await api.core.orbRemove.mutate({
										uuid: data.resourceData.uuid,
									})
									await updateData()
								}
							},
						},
					]
				} else if (elData.resource === 'pod') {
					return [
						{
							content: 'Go To',
							select(el) {
								const data = el.data() as t.CytoscapeElementData

								router.push(`/pod/${data.resourceData.uuid}`)
							},
						},
					]
				} else if (elData.resource === 'model') {
					return [
						{
							content: 'Go To',
							select(el) {
								const data = el.data() as t.CytoscapeElementData

								router.push(`/model/${data.resourceData.uuid}`)
							},
						},
						{
							content: 'Edit Properties',
							select(el) {
								const data = el.data() as t.CytoscapeElementData

								handlePopupModelEditProperties(data.resourceData)
							},
						},
						{
							content: 'Create Child',
							async select(el) {
								const data = el.data() as t.CytoscapeElementData

								const modelPlugin = plugin.get('model', 'color') // TODO
								handlePopupModelCreateChild(
									data.resourceData,
									modelPlugin.validateNewChild,
								)
							},
						},
					]
				} else {
					return []
				}
			},
		})
		cy.cxtmenu({
			selector: 'edge',
			...ctxMenuDefaults,
			commands(el) {
				const data = el.data()
				const json = el.json()

				return [
					{
						content: 'Remove Edge',
						async select(el) {
							const json = el.json()

							if (globalThis.confirm('Are you sure?')) {
								await api.core.podRemove.mutate({
									uuid: json?.data?.my?.podUuid,
								})
							}
							await updateData()
						},
					},
				]
			},
		})
		cy.cxtmenu({
			selector: 'core',
			...ctxMenuDefaults,
			commands: [
				{
					content: 'Create Model',
					select() {
						handlePopupModelCreate()
					},
				},
			],
		})
	}

	await updateData()
})

async function updateData() {
	if (!cy) throw new Error('cy is undefined')

	let elements: cytoscape.ElementDefinition[] = []

	// models
	const { models } = await api.core.modelList.query()
	for (const model of models) {
		elements.push({
			group: 'nodes',
			classes: 'qp-model',
			...{
				position: model?.extra?.position && {
					x: model.extra.position.x,
					y: model.extra.position.y,
				},
			},
			data: {
				id: model.uuid,
				label: model.name,
				resource: 'model',
				resourceData: model,
			},
		})

		// orbs (attached by models)
		const { orbs } = await api.core.orbList.query({
			model: { uuid: model.uuid },
		})
		const { pods } = await api.core.podList.query({
			model: { uuid: model.uuid },
		})

		const modelPlugin = plugin.get('model', model.plugin)
		const { elements: newElements } = modelPlugin.arrangeElements(
			model,
			pods,
			orbs,
		)
		elements = elements.concat(newElements)
	}

	cy.remove(cy.nodes('*'))
	cy.add(elements)
	cy.layout(cyLayout).run()
}

async function handlePopupModelCreate() {
	await popup.showNoData('model-create', ModelCreatePopup)
	await updateData()
}

async function handlePopupModelEditProperties(model: t.Model_t) {
	await popup.show('model-edit-properties', ModelEditPropertiesPopup, {
		uuid: model.uuid,
		oldName: model.name || '',
	})
	await updateData()
}

async function handlePopupModelCreateChild(
	model: t.Model_t,
	validationFn: t.ModelClientPlugin_t['validateNewChild'],
) {
	await popup.show('model-create-child', ModelCreateChildPopup, {
		modelUuid: model.uuid,
		validationFn,
	})
	await updateData()
}
</script>
