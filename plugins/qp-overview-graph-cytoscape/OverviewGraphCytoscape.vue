<template>
	<div ref="cytoscapeContainer" style="height: 100%"></div>
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
	<PodCreatePopup
		:show="boolCreatePod"
		:data="dataCreatePod"
		@submit="afterCreatePod"
		@cancel="() => (boolCreatePod = false)"
	/>
	<PodRenamePopup
		:show="boolRenamePod"
		:podUuid="dataRenamePod.podUuid"
		:oldName="dataRenamePod.oldName"
		@submit="afterRenamePod"
		@cancel="() => (boolRenamePod = false)"
	/>
	<ViewCreatePopup
		:show="boolCreateView"
		:data="dataCreateView"
		@submit="afterCreateView"
		@cancel="() => (boolCreateView = false)"
	/>
	<GroupCreatePopup
		:show="boolGroupCreate"
		:data="dataGroupCreate"
		@submit="afterGroupCreate"
		@cancel="() => (boolGroupCreate = false)"
	/>
	<GroupRenamePopup
		:show="boolRenameGroup"
		:data="dataRenameGroup"
		@submit="afterRenameGroup"
		@cancel="() => (boolRenameGroup = false)"
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
import cytoscapeLasso from 'cytoscape-lasso'
import cytoscapeCtxMenu from 'cytoscape-cxtmenu'
import cytoscapeUndoRedo from 'cytoscape-undo-redo'
import cytoscapeEdgehandles from 'cytoscape-edgehandles'
import cytoscapeCompoundDragAndDrop from 'cytoscape-compound-drag-and-drop'

import { apiObj as api } from '@quasipanacea/common/trpcClient'

import type * as t from '@quasipanacea/common/types'
import { defaultTheme } from '@quasipanacea/theme-default/_theme'
import { PopupComponent } from '@quasipanacea/plugin-components/index'
import PodCreatePopup from '@quasipanacea/plugin-components/popups/PodCreatePopup.vue'
import PodRenamePopup from '@quasipanacea/plugin-components/popups/PodRenamePopup.vue'
import GroupCreatePopup from '@quasipanacea/plugin-components/popups/GroupCreatePopup.vue'
import GroupRenamePopup from '@quasipanacea/plugin-components/popups/GroupRenamePopup.vue'
import ViewCreatePopup from '@quasipanacea/plugin-components/popups/ViewCreatePopup.vue'

const router = useRouter()

const currentMode = ref<'default' | 'shift' | 'control'>('default')

let groups = ref<t.Group_t[]>([])
let groupsObj = reactive<Record<string, t.Pod_t[]>>({})
let pods = ref<t.Pod_t[]>([])

let cy: cytoscape.Core | null = null
let cytoscapeContainer = ref<HTMLElement>()

const cyLayout: cytoscape.LayoutOptions = {
	name: 'preset',
	animate: true,
}

onMounted(async () => {
	if (!cytoscapeContainer.value)
		throw new Error('cytoscape container not defined')

	cy = cytoscape({
		container: cytoscapeContainer.value,
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
		const json = el.json()

		if (json.data.my.resource === 'pod') {
			await api.core.podMutate.mutate({
				uuid: json.data.my.podUuid,
				newData: {
					datas: {
						position: json.position,
					},
				},
			})
		} else if (json.data.my.resource === 'group') {
			await api.core.groupMutate.mutate({
				uuid: json.data.my.groupUuid,
				newData: {
					datas: {
						position: json.position,
					},
				},
			})
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
			const edge = addedEdge.json()

			await api.core.podAdd.mutate({
				type: 'edge',
				name: '?',
				plugin: 'markdown',
				sourceUuid: edge.data.source,
				targetUuid: edge.data.target,
			})

			await updateGroups()
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
				const data = el.data()
				const json = el.json()

				if (json.data.my.isGroup) {
					return [
						{
							content: 'Add Pod',
							select(el) {
								const json = el.json()

								showPodCreatePopup(json.data.my.groupUuid)
							},
						},
						{
							content: 'Add View',
							select(el) {
								const json = el.json()

								showCreateViewPopup(json.data.my.groupUuid)
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
									await updateGroups()
								}
							},
						},
						{
							content: 'Rename Group',
							async select(el) {
								const json = el.json()

								showRenameGroupPopup(json.data.my.groupUuid, json.data.label)
							},
						},
					]
				} else if (json.data.my.isPod) {
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

								showRenamePodPopup(json.data.my.podUuid, json.data.label)
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
									await updateGroups()
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
							await updateGroups()
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
			],
		})
	}

	await updateGroups()
})

async function updateGroups() {
	if (!cy) throw new Error('cy is undefined')

	groups.value = (await api.core.groupList.query()).groups
	pods.value = (await api.core.podList.query()).pods
	const uuidsFromPods = Array.from(
		new Set(pods.value.map((item) => item.groupUuid)),
	)
	for (const groupUuid of uuidsFromPods) {
		const arr = pods.value.filter((item) => item.groupUuid === groupUuid)
		groupsObj[groupUuid] = arr
	}

	let elements: cytoscape.ElementDefinition[] = []

	// node for each group
	elements = elements.concat(
		groups.value.map((item) => ({
			data: {
				id: item.uuid,
				label: item.name,
				my: { resource: 'group', isGroup: true, groupUuid: item.uuid },
			},
		})),
	)

	// node for each item of each group
	// if group is empty, placeholder is created
	for (const group of groups.value) {
		const items = pods.value.filter((item) => item.groupUuid === group.uuid)
		if (items.length > 0) {
			for (const item of items) {
				elements.push({
					position: item.datas?.position,
					data: {
						id: item.uuid,
						label: item.name,
						parent: group.uuid,

						my: {
							resource: 'pod',
							isPod: true,
							podUuid: item.uuid,
						},
					},
				})
			}
		} else {
			elements.push({
				position: group.datas?.position,
				data: {
					id: '__PLACEHOLDER: ' + group.uuid,
					label: '__placeholder',
					parent: group.uuid,
					my: {
						resource: 'group',
						isGroup: true,
						groupUuid: group.uuid,
					},
				},
			})
		}
	}

	// edges
	for (const pod of pods.value) {
		if (pod.type === 'edge') {
			elements.push({
				label: pod.name,
				data: {
					id: pod.uuid,
					source: pod.sourceUuid,
					target: pod.targetUuid,
					plugin: pod.plugin,
					uuid: pod.uuid,
					my: {
						podUuid: pod.uuid,
					},
				},
			})
		}
	}

	cy.remove(cy.nodes('*'))
	cy.add(elements)
	cy.layout(cyLayout).run()
}

// popup: create view
const boolCreateView = ref(false)
const dataCreateView = reactive({ groupUuid: '' })
function showCreateViewPopup(uuid: string) {
	dataCreateView.groupUuid = uuid
	boolCreateView.value = true
}
async function afterCreateView(value: unknown) {
	boolCreateView.value = false
	await updateGroups()
}

// popup: create pod
const boolCreatePod = ref(false)
const dataCreatePod = reactive({ groupUuid: '' })
function showPodCreatePopup(uuid: string) {
	dataCreatePod.groupUuid = uuid
	boolCreatePod.value = true
}
async function afterCreatePod(value: unknown) {
	boolCreatePod.value = false
	await updateGroups()
}

// popup: rename pod
const boolRenamePod = ref(false)
const dataRenamePod = reactive({ podUuid: '', oldName: '' })
function showRenamePodPopup(podUuid: string, oldName: string) {
	dataRenamePod.podUuid = podUuid
	dataRenamePod.oldName = oldName
	boolRenamePod.value = true
}
async function afterRenamePod(value: unknown) {
	boolRenamePod.value = false
}

// popup: create group
const boolGroupCreate = ref(false)
const dataGroupCreate = reactive({})
function showGroupCreatePopup() {
	boolGroupCreate.value = true
}
async function afterGroupCreate(value: unknown) {
	boolGroupCreate.value = false
	await updateGroups()
}

// popup: rename group
const boolRenameGroup = ref(false)
const dataRenameGroup = reactive({ groupUuid: '', oldName: '' })
function showRenameGroupPopup(uuid: string, oldName: string) {
	dataRenameGroup.groupUuid = uuid
	dataRenameGroup.oldName = oldName
	boolRenameGroup.value = true
}
async function afterRenameGroup(value: unknown) {
	boolRenameGroup.value = false
	await updateGroups()
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
