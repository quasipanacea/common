<template>
	<div id="graph" style="height: 100%"></div>
	<CreatePodPopup
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
	<CreateCollectionPopup
		:show="boolCreateCollection"
		:data="dataCreateCollection"
		@submit="afterCreateCollection"
		@cancel="() => (boolCreateCollection = false)"
	/>
	<CollectionRenamePopup
		:show="boolRenameCollection"
		:data="dataRenameCollection"
		@submit="afterRenameCollection"
		@cancel="() => (boolRenameCollection = false)"
	/>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import cytoscape from 'cytoscape'
import cytoscapeCola from 'cytoscape-cola'
import cytoscapeCtxMenu from 'cytoscape-cxtmenu'
import cytoscapeCompoundDragAndDrop from 'cytoscape-compound-drag-and-drop'
import cytoscapeLasso from 'cytoscape-lasso'
import cytoscapeUndoRedo from 'cytoscape-undo-redo'

import type * as t from '@common/types'
import { api } from '@/util/api'
import CreatePodPopup from '@common/components/CreatePodPopup.vue'
import PodRenamePopup from '@common/components/popups/PodRenamePopup.vue'
import CreateCollectionPopup from '@common/components/CreateCollectionPopup.vue'
import CollectionRenamePopup from '@common/components/popups/CollectionRenamePopup.vue'

const router = useRouter()

let collections = ref<t.Collection_t[]>([])
let collectionsObj = reactive<Record<string, t.Pod_t[]>>({})
let pods = ref<t.Pod_t[]>([])

let cy: cytoscape.Core | null = null
const cyLayout: cytoscape.LayoutOptions = {
	name: 'cola',
	animate: true,
}

onMounted(async () => {
	cy = cytoscape({
		container: document.getElementById('graph'),
		style: [
			{
				selector: 'node[label]',
				style: {
					label: 'data(label)',
				},
			},

			{
				selector: 'edge[label]',
				style: {
					label: 'data(label)',
					width: 3,
				},
			},
			// {
			// 	selector: 'node',
			// 	css: {
			// 		content: 'data(name)',
			// 	},
			// },

			// {
			// 	selector: 'edge',
			// 	css: {
			// 		'curve-style': 'bezier',
			// 		'target-arrow-shape': 'triangle',
			// 	},
			// },
		],
		minZoom: 0.5,
		maxZoom: 3,
	})

	let cyDND = null
	{
		// Check before '.use()' to prevent spurious warnings on hot-reload
		if (!Object.getPrototypeOf(cy)['cxtmenu']) {
			cytoscape.use(cytoscapeCtxMenu)
		}
		if (!Object.getPrototypeOf(cy)['compoundDragAndDrop']) {
			cytoscape.use(cytoscapeCompoundDragAndDrop)
		}
		if (!Object.getPrototypeOf(cy)['lassoSelectionEnabled']) {
			cytoscape.use(cytoscapeLasso)
		}
		if (!Object.getPrototypeOf(cy)['undoRedo']) {
			cytoscape.use(cytoscapeUndoRedo)
		}
		cytoscape.use(cytoscapeCola)
		// console.log(Object.getPrototypeOf(cy))

		cyDND = cy.compoundDragAndDrop()
		cyDND.disable()

		cy.lassoSelectionEnabled(true)

		cy.cxtmenu({
			selector: 'node',
			commands: (el) => {
				const json = el.json()

				if (json.data?.data?.isCollection) {
					return [
						{
							content: 'Add Pod',
							select: (el) => {
								const json = el.json()

								showCreatePodPopup(json?.data?.data?.collectionUuid)
							},
						},
						{
							content: 'Delete Collection',
							select: async (el) => {
								const json = el.json()

								if (globalThis.confirm('Are you sure')) {
									await api.collectionRemove.mutate({
										uuid: json?.data?.data?.collectionUuid,
									})
									await updateCollections()
								}
							},
						},
						{
							content: 'Rename Collection',
							select: async (el) => {
								const json = el.json()

								showRenameCollectionPopup(
									json?.data?.data?.collectionUuid,
									json?.data?.label,
								)
							},
						},
					]
				} else if (json.data?.data?.isPod) {
					return [
						{
							content: 'Go To Pod',
							select: (el) => {
								const json = el.json()
								const podUuid = json.data?.data?.podUuid

								router.push(`/pod/${podUuid}`)
							},
						},
						{
							content: 'Rename Pod',
							select: async (el) => {
								const json = el.json()

								showRenamePodPopup(json.data?.data?.podUuid, json.data?.label)
							},
						},
						{
							content: 'Delete Pod',
							select: async (el) => {
								if (globalThis.confirm('Are you sure?')) {
									const json = el.json()
									const podUuid = json.data?.data?.podUuid

									await api.podRemove.mutate({
										uuid: podUuid,
									})
									await updateCollections()
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
			selector: 'core',
			commands: [
				{
					content: 'Create Collection',
					select: (el) => {
						showCreateCollectionPopup()
					},
				},
				{
					content: 'Enable DND',
					select: (el) => {
						cyDND.enable()
					},
				},
				{
					content: 'Disable DND',
					select: (el) => {
						cyDND.disable()
					},
				},
			],
		})
	}

	await updateCollections()
})

async function updateCollections() {
	collections.value = (await api.collectionList.query()).collections
	pods.value = (await api.podList.query()).pods

	const uuidsFromPods = Array.from(
		new Set(pods.value.map((item) => item.collectionUuid)),
	)
	for (const collectionUuid of uuidsFromPods) {
		const arr = pods.value.filter(
			(item) => item.collectionUuid === collectionUuid,
		)
		collectionsObj[collectionUuid] = arr
	}

	let edges: cytoscape.CytoscapeOptions['elements'] = []
	let nodes: cytoscape.CytoscapeOptions['elements'] = []

	// node for each collection
	nodes = nodes.concat(
		collections.value.map((item) => ({
			data: {
				id: item.uuid,
				label: item.name,
				data: { isCollection: true, collectionUuid: item.uuid },
			},
		})),
	)

	// node for each item of each collection
	// if collection is empty, placeholder is created
	for (const collection of collections.value) {
		const items = pods.value.filter(
			(item) => item.collectionUuid === collection.uuid,
		)
		if (items.length > 0) {
			nodes = nodes.concat(
				items.map((item) => ({
					data: {
						id: item.uuid,
						label: item.name,
						parent: collection.uuid,
						data: { isPod: true, podUuid: item.uuid },
					},
				})),
			)
		} else {
			nodes.push({
				data: {
					id: '__PLACEHOLDER: ' + collection.uuid,
					label: '__placeholder',
					parent: collection.uuid,
					data: {},
				},
			})
		}
	}
	cy.remove(cy?.nodes('*'))
	cy.add(nodes)
	cy.layout(cyLayout).run()
}

// popup: create pod
const boolCreatePod = ref(false)
const dataCreatePod = reactive({ collectionUuid: '' })
function showCreatePodPopup(uuid: string) {
	dataCreatePod.collectionUuid = uuid
	boolCreatePod.value = true
}
async function afterCreatePod(value: unknown) {
	boolCreatePod.value = false
	await updateCollections()
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

// popup: create collection
const boolCreateCollection = ref(false)
const dataCreateCollection = reactive({})
function showCreateCollectionPopup() {
	boolCreateCollection.value = true
}
async function afterCreateCollection(value: unknown) {
	boolCreateCollection.value = false
	await updateCollections()
}

// popup: rename collection
const boolRenameCollection = ref(false)
const dataRenameCollection = reactive({ collectionUuid: '', oldName: '' })
function showRenameCollectionPopup(uuid: string, oldName: string) {
	dataRenameCollection.collectionUuid = uuid
	dataRenameCollection.oldName = oldName
	boolRenameCollection.value = true
}
async function afterRenameCollection(value: unknown) {
	boolRenameCollection.value = false
	await updateCollections()
}
</script>
