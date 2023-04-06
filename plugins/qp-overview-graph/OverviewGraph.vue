<template>
	<div ref="cytoscapeEl" style="height: 100%"></div>
	<div style="position: absolute; top: 0; right: 0">
		<span>{{
			currentMode === 'default'
				? 'Node Move'
				: currentMode === 'shift'
				? 'Draw Connection'
				: currentMode === 'control'
				? 'Node Add/Remove'
				: 'Node Move'
		}}</span>
		<div class="dropdown is-right is-hoverable">
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
			</div>
		</div>
	</div>
	<AnchorCreatePopup
		:show="boolAnchorCreate"
		:data="dataAnchorCreate"
		@submit="afterAnchorCreate"
		@cancel="() => (boolAnchorCreate = false)"
	/>
	<CoverCreatePopup
		:show="boolCoverCreate"
		:data="dataCoverCreate"
		@submit="afterCoverCreate"
		@cancel="() => (boolCoverCreate = false)"
	/>
	<GroupCreatePopup
		:show="boolGroupCreate"
		:data="dataGroupCreate"
		@submit="afterGroupCreate"
		@cancel="() => (boolGroupCreate = false)"
	/>
	<GroupRenamePopup
		:show="boolGroupRename"
		:data="dataGroupRename"
		@submit="afterGroupRename"
		@cancel="() => (boolGroupRename = false)"
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
import { onMounted, onUnmounted, reactive, ref } from 'vue'
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
import AnchorCreatePopup from '@quasipanacea/plugin-components/popups/AnchorCreatePopup.vue'
import CoverCreatePopup from '@quasipanacea/plugin-components/popups/CoverCreatePopup.vue'
import GroupCreatePopup from '@quasipanacea/plugin-components/popups/GroupCreatePopup.vue'
import GroupRenamePopup from '@quasipanacea/plugin-components/popups/GroupRenamePopup.vue'
import PodCreatePopup from '@quasipanacea/plugin-components/popups/PodCreatePopup.vue'
import PodRenamePopup from '@quasipanacea/plugin-components/popups/PodRenamePopup.vue'

const router = useRouter()

const currentMode = ref<'default' | 'shift' | 'control'>('default')
let groups = ref<t.Group_t[]>([])
let groupsObj = reactive<Record<string, t.Pod_t[]>>({})
let pods = ref<t.Pod_t[]>([])

let cy: cytoscape.Core | null = null
let cytoscapeEl = ref<HTMLElement>()

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

	let isReady = false
	cy.on('ready', () => {
		isReady = true
	})
	cy.on('position', async (ev) => {
		// Prevent spam of event on initial load
		if (!isReady) return

		const el = ev.target
		console.log(el)
		const json = el.json()

		// if (json.data.my.resource === 'pod') {
		// 	await api.core.podMutate.mutate({
		// 		uuid: json.data.my.podUuid,
		// 		newData: {
		// 			datas: {
		// 				position: json.position,
		// 			},
		// 		},
		// 	})
		// } else if (json.data.my.resource === 'group') {
		// 	await api.core.groupMutate.mutate({
		// 		uuid: json.data.my.groupUuid,
		// 		newData: {
		// 			datas: {
		// 				position: json.position,
		// 			},
		// 		},
		// 	})
		// }
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

		cy.layout({
			name: 'fcose',
		}).run()

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
			const edge = addedEdge.json()

			// await api.core.podAdd.mutate({
			// 	type: 'edge',
			// 	name: '?',
			// 	plugin: 'markdown',
			// 	sourceUuid: edge.data.source,
			// 	targetUuid: edge.data.target,
			// })

			await updateGraph()
		})
		const abortController1 = new AbortController()
		const abortController2 = new AbortController()
		document.addEventListener(
			'keydown',
			(ev) => {
				if (ev.shiftKey) {
					cyEdgeHandle.enableDrawMode()
					cyEdgeHandle.enable()
					currentMode.value = 'shift'
				} else if (ev.ctrlKey) {
					cyDND.enable()
					currentMode.value = 'control'
				}
			},
			{ signal: abortController1.signal },
		)
		document.addEventListener(
			'keyup',
			(ev) => {
				if (ev.key === 'Shift') {
					cyEdgeHandle.disableDrawMode()
					cyEdgeHandle.disable()
				} else if (ev.key === 'Control') {
					cyDND.disable()
				}
				currentMode.value = 'default'
			},
			{ signal: abortController1.signal },
		)
		onUnmounted(() => {
			abortController1.abort()
			abortController2.abort()
		})

		// context menu
		const ctxMenuDefaults = {
			openMenuEvents: 'cxttapstart',
		}
		cy.cxtmenu({
			selector: 'node',
			...ctxMenuDefaults,
			commands(el) {
				type TempJson = {
					classes?: string
					data: TempData
					grabbable: boolean
					group: string
					locked: boolean
					pannable: boolean
					position: {
						x: number
						y: number
					}
					removed: boolean
					selectable: boolean
					selected: boolean
				}
				type TempData = {
					id?: string
					label?: string
					resource: string
					resourceData: Record<string, unknown>
				}
				const json = el.json() as TempJson
				const data = el.data() as TempData
				console.log('data', data)
				console.log('json', json)

				if (data.resource === 'anchor') {
					return [
						{
							content: 'Go to Anchor',
							select(el) {
								const json = el.json()
								const data = el.data()

								router.push(`/anchor/${data.resourceData.uuid}`)
							},
						},
					]
				} else if (data.resource === 'group') {
					return [
						{
							content: 'Add Pod',
							select(el) {
								const json = el.json()

								showPodCreatePopup(json.data.my.groupUuid)
							},
						},
						{
							content: 'Add Cover',
							select(el) {
								const json = el.json()

								showCoverCreatePopup(json.data.my.groupUuid)
							},
						},
						{
							content: 'Go to Group',
							select(el) {
								const json = el.json()

								router.push(`/group/${json.data.my.groupUuid}`)
							},
						},
						{
							content: 'Delete Group',
							async select(el) {
								const json = el.json()

								if (globalThis.confirm('Are you sure')) {
									await api.core.groupRemove.mutate({
										uuid: json?.data?.my?.groupUuid,
									})
									await updateGraph()
								}
							},
						},
						{
							content: 'Rename Group',
							async select(el) {
								const json = el.json()

								showGroupRenamePopup(json.data.my.groupUuid, json.data.label)
							},
						},
					]
				} else if (data.resource === 'pod') {
					return [
						{
							content: 'Go To Pod',
							select(el) {
								const json = el.json()
								const podUuid = json.data.my.podUuid

								router.push(`/pod/${podUuid}`)
							},
						},
						{
							content: 'Rename Pod',
							async select(el) {
								const json = el.json()

								showPodRenamePopup(json.data.my.podUuid, json.data.label)
							},
						},
						{
							content: 'Delete Pod',
							async select(el) {
								if (globalThis.confirm('Are you sure?')) {
									const json = el.json()
									const podUuid = json.data.my.podUuid

									await api.core.podRemove.mutate({
										uuid: podUuid,
									})
									await updateGraph()
								}
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
							await updateGraph()
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
					content: 'Create Group',
					select() {
						showGroupCreatePopup()
					},
				},
				{
					content: 'Create Anchor',
					select() {
						showAnchorCreatePopup()
					},
				},
			],
		})
	}

	await updateGraph()
})

async function updateGraph() {
	if (!cy) throw new Error('cy is undefined')

	let elements: cytoscape.ElementDefinition[] = []

	const { anchors } = await api.core.anchorList.query()
	for (const anchor of anchors) {
		elements.push({
			data: {
				label: anchor.name,
				resource: 'anchor',
				resourceData: anchor,
			},
		})
	}

	cy.remove(cy.nodes('*'))
	cy.add(elements)
	cy.layout(cyLayout).run()
}

// popup: anchor create
const boolAnchorCreate = ref(false)
const dataAnchorCreate = reactive({ groupUuid: '' })
function showAnchorCreatePopup() {
	boolAnchorCreate.value = true
}
async function afterAnchorCreate(value: unknown) {
	boolAnchorCreate.value = false
	await updateGraph()
}

// popup: cover create
const boolCoverCreate = ref(false)
const dataCoverCreate = reactive({ groupUuid: '' })
function showCoverCreatePopup(uuid: string) {
	dataCoverCreate.groupUuid = uuid
	boolCoverCreate.value = true
}
async function afterCoverCreate(value: unknown) {
	boolCoverCreate.value = false
	await updateGraph()
}

// popup: group create
const boolGroupCreate = ref(false)
const dataGroupCreate = reactive({})
function showGroupCreatePopup() {
	boolGroupCreate.value = true
}
async function afterGroupCreate(value: unknown) {
	boolGroupCreate.value = false
	await updateGraph()
}

// popup: group rename
const boolGroupRename = ref(false)
const dataGroupRename = reactive({ groupUuid: '', oldName: '' })
function showGroupRenamePopup(uuid: string, oldName: string) {
	dataGroupRename.groupUuid = uuid
	dataGroupRename.oldName = oldName
	boolGroupRename.value = true
}
async function afterGroupRename(value: unknown) {
	boolGroupRename.value = false
	await updateGraph()
}

// popup: pod create
const boolPodCreate = ref(false)
const dataPodCreate = reactive({ groupUuid: '' })
function showPodCreatePopup(uuid: string) {
	dataPodCreate.groupUuid = uuid
	boolPodCreate.value = true
}
async function afterPodCreate(value: unknown) {
	boolPodCreate.value = false
	await updateGraph()
}

// popup: pod rename
const boolPodRename = ref(false)
const dataPodRename = reactive({ podUuid: '', oldName: '' })
function showPodRenamePopup(podUuid: string, oldName: string) {
	dataPodRename.podUuid = podUuid
	dataPodRename.oldName = oldName
	boolPodRename.value = true
}
async function afterPodRename(value: unknown) {
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
