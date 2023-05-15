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
					<span class="icon is-small">
						<i class="fas fa-angle-down" aria-hidden="true"></i>
					</span>
				</button>
			</div>
			<div class="dropdown-menu" id="dropdown-menu" role="menu">
				<div class="dropdown-content">
					<a @click="showGuidePopup" class="dropdown-item">Show Guide</a>
				</div>
				<div class="dropdown-content">
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
	<ModelCreateChildPopup
		:show="boolModelCreateChild"
		:data="dataModelCreateChild"
		@submit="afterModelCreateChild"
		@cancel="() => (boolModelCreateChild = false)"
	/>
	<ModelCreatePopup
		:show="boolModelCreate"
		:data="dataModelCreate"
		@submit="afterModelCreate"
		@cancel="() => (boolModelCreate = false)"
	/>
	<ModelEditPropertiesPopup
		:show="boolModelEditProperties"
		:data="dataModelEditProperties"
		@submit="afterModelEditProperties"
		@cancel="() => (boolModelEditProperties = false)"
	/>
	<PodCreatePopup
		:show="boolPodCreate"
		:data="dataPodCreate"
		@submit="afterPodCreate"
		@cancel="() => (boolPodCreate = false)"
	/>
	<PodRenamePopup
		:show="boolPodRename"
		:podUuid="dataPodRename.podUuid"
		:oldName="dataPodRename.oldName"
		@submit="afterPodRename"
		@cancel="() => (boolPodRename = false)"
	/>
	<PopupComponent :show="boolGuide" @cancel="afterShowGuide">
		<div class="content">
			<h2>Guide</h2>
			<ul>
				<li>Left-click to pan</li>
				<li>Left-click (hold) to connect nodes</li>
				<li>Right-click for context menu</li>
			</ul>
		</div>
	</PopupComponent>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import cytoscape from 'cytoscape'
import cytoscapeCola from 'cytoscape-cola'
import cytoscapeFcose from 'cytoscape-fcose'
import cytoscapeLasso from 'cytoscape-lasso'
import cytoscapeCtxMenu from 'cytoscape-cxtmenu'
import cytoscapeUndoRedo from 'cytoscape-undo-redo'
import cytoscapeEdgehandles from 'cytoscape-edgehandles'
import cytoscapeCompoundDragAndDrop from 'cytoscape-compound-drag-and-drop'

import { apiObj as api } from '@quasipanacea/common/trpcClient'

import type * as t from '@quasipanacea/common/types'
import { defaultTheme } from '@quasipanacea/theme-default/_theme'
import { PopupComponent } from '@quasipanacea/plugin-components/index'
import {
	ViewCreatePopup,
	ModelCreateChildPopup,
	ModelCreatePopup,
	ModelEditPropertiesPopup,
	PodCreatePopup,
	PodRenamePopup,
} from '@quasipanacea/plugin-components/popups/index.js'

const router = useRouter()

let cy: cytoscape.Core | null = null
let cytoscapeEl = ref<HTMLElement>()

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

		const cyDND = cy.compoundDragAndDrop()
		cyDND.disable()

		cy.lassoSelectionEnabled(false)

		// edge handle
		const cyEdgeHandle = cy.edgehandles({
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

			await updateOverview()
		})

		function keydownFn(ev: KeyboardEvent) {
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
			if (ev.key === 'Shift') {
				cyEdgeHandle.disableDrawMode()
				cyEdgeHandle.disable()
			} else if (ev.key === 'Control') {
				cyDND.disable()
			}
			currentMode.value = 'default'
		}

		document.addEventListener('keydown', keydownFn)
		document.addEventListener('keyup', keyupFn)
		onUnmounted(() => {
			document.removeEventListener('keydown', keydownFn)
			document.removeEventListener('keyup', keyupFn)
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
					if (elData.resourceData.pod) {
						return [
							{
								content: 'Go to Pod',
								select(el) {
									const data = el.data() as t.CytoscapeElementData
								},
							},
						]
					} else {
						return [
							{
								content: 'Delete Orb',
								async select(el) {
									const data = el.data() as t.CytoscapeElementData

									await api.core.orbRemove.mutate({
										uuid: data.resourceData.uuid,
									})
									await updateOverview()
								},
							},
						]
					}
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

								showModelEditPropertiesPopup(data.resourceData)
							},
						},
						{
							content: 'Create Child',
							async select(el) {
								const data = el.data() as t.CytoscapeElementData

								const modelPlugin = await import(
									'@quasipanacea/model-group-simple/_client'
								) // TODO
								showModelCreateChildPopup(
									data.resourceData,
									modelPlugin.validateNewChild,
								)
							},
						},
						{
							content: 'Create Child NEW',
							async select(el) {
								const data = el.data() as t.CytoscapeElementData
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
							await updateOverview()
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
						showModelCreatePopup()
					},
				},
			],
		})
	}

	await updateOverview()
})

async function updateOverview() {
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

		const modelPlugin = await import('@quasipanacea/model-group-simple/_client')
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

// popup: model create
const boolModelCreate = ref(false)
const dataModelCreate = reactive({})
function showModelCreatePopup() {
	boolModelCreate.value = true
}
async function afterModelCreate() {
	boolModelCreate.value = false
	await updateOverview()
}

// popup: model edit properties
const boolModelEditProperties = ref(false)
const dataModelEditProperties = reactive({ uuid: '', oldName: '' })
function showModelEditPropertiesPopup(model: t.Model_t) {
	dataModelEditProperties.uuid = model.uuid
	dataModelEditProperties.oldName = model.name || ''
	boolModelEditProperties.value = true
}
async function afterModelEditProperties() {
	boolModelEditProperties.value = false
	await updateOverview()
}

// popup: model create child
const boolModelCreateChild = ref(false)
const dataModelCreateChild = reactive({ modelUuid: '' })
function showModelCreateChildPopup(
	model: t.Model_t,
	validationFn: t.PluginExportClient_t['validateNewChild'],
) {
	dataModelCreateChild.modelUuid = model.uuid
	boolModelCreateChild.value = true
}
async function afterModelCreateChild() {
	boolModelCreateChild.value = false
	await updateOverview()
}

// popup: pod create
const boolPodCreate = ref(false)
const dataPodCreate = reactive({ modelUuid: '' })
function showPodCreatePopup(uuid: string) {
	dataPodCreate.modelUuid = uuid
	boolPodCreate.value = true
}
async function afterPodCreate() {
	boolPodCreate.value = false
	await updateOverview()
}

// popup: pod rename
const boolPodRename = ref(false)
const dataPodRename = reactive({ podUuid: '', oldName: '' })
function showPodRenamePopup(podUuid: string, oldName: string) {
	dataPodRename.podUuid = podUuid
	dataPodRename.oldName = oldName
	boolPodRename.value = true
}
async function afterPodRename() {
	boolPodRename.value = false
}

// popup: guide
const boolGuide = ref(false)
function showGuidePopup() {
	boolGuide.value = true
}
function afterShowGuide() {
	boolGuide.value = false
}
</script>
