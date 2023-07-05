<template>
	<div ref="cytoscapeEl" style="height: 100%"></div>
	<div class="m-1" style="position: absolute; top: 0; left: 0">
		<span class="button">
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
	</div>
	<div
		class="m-1 p-1"
		style="
			position: absolute;
			top: 2px;
			right: 2px;
			border: 1px solid black;
			backdrop-filter: blur(25px);
			background-color: white;
			border-radius: 5px;
		"
	>
		<aside class="menu">
			<p class="menu-label">General</p>
			<ul class="menu-list">
				<li>
					<a @click="popup.showNoData('null', GuidePopup)"> Show Guide </a>
				</li>
			</ul>

			<p class="menu-label">Layout</p>
			<ul class="menu-list">
				<li>
					<a>
						<div class="select">
							<select v-model="currentLayout">
								<option value="automatic">Automatic Layout</option>
								<option value="manual">Manual Layout</option>
							</select>
						</div>
					</a>
				</li>
			</ul>
		</aside>
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
	pluginClient,
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
	cy = cytoscape({
		container: cytoscapeEl.value!,
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

								const modelPlugin = pluginClient.get('model', 'colors') // TODO
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

		function arrangeElements(
			model: t.Model_t,
			pods: t.Pod_t[],
			orbs: t.Orb_t[],
		): { elements: cytoscape.ElementDefinition[] } {
			const elements: cytoscape.ElementDefinition[] = []

			// pods
			for (const pod of pods) {
				elements.push({
					group: 'nodes',
					// classes: [
					// 	'qp-pod',
					// 	...(orb.pod ? ['qp-orb-with-pod'] : ['qp-orb-without-pod']),
					// ],
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

			// orbs
			for (const orb of orbs) {
				elements.push({
					group: 'nodes',
					classes: [
						'qp-orb',
						...(orb.pod ? ['qp-orb-with-pod'] : ['qp-orb-without-pod']),
					],
					...{
						position: orb?.extra?.position && {
							x: orb.extra.position.x,
							y: orb.extra.position.y,
						},
					},
					data: {
						id: orb.uuid,
						label: orb.name,
						resource: 'orb',
						resourceData: orb,
					},
				})

				elements.push({
					group: 'edges',
					classes: 'qp-link',
					data: {
						id: crypto.randomUUID(),
						source: orb.uuid,
						target: orb.model.uuid,
					},
				})
			}

			return { elements }
		}
		const { elements: newElements } = arrangeElements(model, pods, orbs)
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
