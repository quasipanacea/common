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

	cy.on('dragfree', async (ev) => {
		const elJson = ev.target.json() as t.CytoscapeElementJson
		const elData = ev.target.data() as t.CytoscapeElementData

		if (elData.resource === 'orb') {
			await api.core.orbModify.mutate({
				uuid: elData.resourceData.uuid,
				data: {
					extras: {
						position: {
							x: elJson.position.x,
							y: elJson.position.y,
						},
					},
				},
			})
		} else if (elData.resource === 'anchor') {
			await api.core.anchorModify.mutate({
				uuid: elData.resourceData.uuid,
				data: {
					extras: {
						position: {
							x: elJson.position.x,
							y: elJson.position.y,
						},
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
								content: 'Go to Orb',
								select(el) {
									const data = el.data()
								},
							},
						]
					} else {
						return []
					}
				} else if (elData.resource === 'anchor') {
					return [
						{
							content: 'Go to Anchor',
							select(el) {
								const data = el.data()

								router.push(`/anchor/${data.resourceData.uuid}`)
							},
						},
						{
							content: 'Create child Orb',
							async select(el) {
								const data = el.data()

								await api.core.orbAdd.mutate({
									anchor: {
										uuid: elData.resourceData.uuid,
									},
								})
								await updateOverview()
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
					content: 'Create Anchor',
					select() {
						showAnchorCreatePopup()
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

	// orbs
	const { orbs } = await api.core.orbList.query()
	for (const orb of orbs) {
		elements.push({
			group: 'nodes',
			classes: [
				'qp-orb',
				...(orb.pod ? ['qp-orb-with-pod'] : ['qp-orb-without-pod']),
			],
			...{
				position: orb?.extras?.position && {
					x: orb.extras.position.x,
					y: orb.extras.position.y,
				},
			},
			data: {
				id: orb.uuid,
				label: orb.name,
				resource: 'orb',
				resourceData: orb,
			},
		})
	}

	// links
	for (const orb of orbs) {
		elements.push({
			group: 'edges',
			classes: 'qp-link',
			data: {
				id: crypto.randomUUID(),
				source: orb.uuid,
				target: orb.anchor.uuid,
			},
		})
	}

	// anchors
	const { anchors } = await api.core.anchorList.query()
	for (const anchor of anchors) {
		elements.push({
			group: 'nodes',
			classes: 'qp-anchor',
			...{
				position: anchor?.extras?.position && {
					x: anchor.extras.position.x,
					y: anchor.extras.position.y,
				},
			},
			data: {
				id: anchor.uuid,
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
async function afterAnchorCreate() {
	boolAnchorCreate.value = false
	await updateOverview()
}

// popup: cover create
const boolCoverCreate = ref(false)
const dataCoverCreate = reactive({ groupUuid: '' })
function showCoverCreatePopup(uuid: string) {
	dataCoverCreate.groupUuid = uuid
	boolCoverCreate.value = true
}
async function afterCoverCreate() {
	boolCoverCreate.value = false
	await updateOverview()
}

// popup: pod create
const boolPodCreate = ref(false)
const dataPodCreate = reactive({ groupUuid: '' })
function showPodCreatePopup(uuid: string) {
	dataPodCreate.groupUuid = uuid
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
