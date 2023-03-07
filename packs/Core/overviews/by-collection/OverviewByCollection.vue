<template>
	<div style="display: flex; flex-direction: row; height: 100%">
		<template v-for="collection of collections" :key="collection">
			<div>
				<button @click="deleteCollection(collection.uuid)" class="pure-button">
					Delete
				</button>
				<button
					@click="showCreatePodPopup(collection.uuid)"
					class="pure-button pure-button-primary"
				>
					New Pod
				</button>
				<div style="width: 200px; margin: 5px">
					<h2 style="display: inline">{{ collection.name }}</h2>
					<span> ({{ collection.pluginId }})</span>
					<div v-for="pod of collectionsObj[collection.uuid]">
						<a :href="'/pod/' + pod.uuid">{{ pod.name }} </a>
						<span> ({{ pod.pluginId }})</span>
					</div>
				</div>
			</div>
			<div style="border: 1px solid var(--oc-gray-3)"></div>
		</template>
		<div style="min-width: 200px; text-align: center; margin-top: 180px">
			<button
				class="pure-button pure-button-primary"
				@click="showCreateCollectionPopup"
			>
				New Collection
			</button>
		</div>
	</div>
	<CreatePodPopup
		:show="boolCreatePod"
		:data="dataCreatePod"
		@submit="afterCreatePod"
		@cancel="() => (boolCreatePod = false)"
	/>
	<CreateCollectionPopup
		:show="boolCreateCollection"
		:data="dataCreateCollection"
		@submit="afterCreateCollection"
		@cancel="() => (boolCreateCollection = false)"
	/>
</template>

<script setup lang="ts">
import { onMoun
	ted, reactive, ref } from 'vue'

import { apiObj as api } from '@/util/api'

import type * as t from '@common/types'
import CreatePodPopup from '@common/shared/components/popups/CreatePodPopup.vue'
import CreateCollectionPopup from '@common/shared/components/popups/CreateCollectionPopup.vue'

let collections = ref<t.Collection_t[]>([])
let collectionsObj = reactive<Record<string, t.Pod_t[]>>({})

const collectionPluginOptions = ref<{ label: string; value: string }[]>([])
const collectionFormData = reactive({ name: '', pluginId: '' })

onMounted(async () => {
	await updateCollections()

	const plugins = await api.core.pluginList.query()
	collectionPluginOptions.value = plugins.plugins
		.filter((item) => item.kind === 'collection')
		.map((item) => ({
			label: item.id,
			value: item.id,
		}))
})

async function updateCollections() {
	collections.value = (await api.core.collectionList.query()).collections

	const pods = (await api.core.podList.query()).pods
	for (const collectionUuid of Array.from(
		new Set(pods.map((item) => item.collectionUuid)),
	)) {
		const arr = pods.filter((item) => item.collectionUuid === collectionUuid)
		collectionsObj[collectionUuid] = arr
	}
}

async function getCollectionPods(collectionUuid: string) {
	const result = await api.core.podList.query()
	const pods = result.pods.filter((item) => {
		return (item.collectionUuid = collectionUuid)
	})

	return pods
}
async function createCollection() {
	await api.core.collectionAdd.mutate(collectionFormData)
	await updateCollections()
}
async function deleteCollection(uuid: string) {
	if (globalThis.confirm('Are you sure?')) {
		await api.core.collectionRemove.mutate({ uuid })
		await updateCollections()
	}
}
async function createPod() {
	await api.core.podAdd.mutate(podFormData)
	await updateCollections()
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
</script>
