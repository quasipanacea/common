<template>
	<div>
		<h1 class="title" style="margin-block-end: 0">{{ model?.name }}</h1>
		<button class="button" @click="router.back()">Back</button>
		<button class="button" @click="showPodCreatePopup">New</button>

		<h2 class="subtitle">Pods</h2>
		<div v-for="pod of pods" :key="pod.uuid">
			<div class="card" style="width: 300px">
				<div class="card-content">
					<div class="media">
						<div class="media-content">
							<p class="title is-3">{{ pod.name }}</p>
							<p class="subtitle is-6">%{{ pod.plugin }}</p>
						</div>
					</div>
					<div class="content">
						<template v-if="pod.extra?.['model.flat']?.description">
							{{ pod.extra?.['model.flat']?.description }}
						</template>
						<template v-else>
							<em>No description</em>
						</template>
						<div class="tags">
							<span
								v-for="tag of pod.extra?.['model.flat']?.tags"
								class="tag"
								:key="tag"
							>
								{{ tag }}
							</span>
						</div>
					</div>
				</div>
				<footer class="card-footer">
					<router-link :to="'/pod/' + pod.uuid" class="card-footer-item">
						View
					</router-link>
					<a
						class="card-footer-item"
						@click="
							podEditMetaData(
								pod.uuid,
								pod.name,
								pod.extra?.['model.flat']?.description,
								pod.extra?.['model.flat']?.tags,
							)
						"
						>Edit Metadata</a
					>
				</footer>
			</div>
		</div>
	</div>
	<PodCreatePopup
		:show="boolPodCreate"
		:data="dataPodCreate"
		@submit="afterPodCreate"
		@cancel="() => (boolPodCreate = false)"
	/>
	<PodEditMetadata
		:show="boolPodEditMetadata"
		:data="dataPodEditMetadata"
		@submit="afterPodEditMetadata"
		@cancel="() => (boolPodEditMetadata = false)"
	/>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { apiObj as api } from '@quasipanacea/common/trpcClient.js'
import type * as t from '@quasipanacea/common/types.js'

import { PodCreatePopup } from '@quasipanacea/plugin-components/popups/index.js'
import PodEditMetadata from './util/PodEditMetadata.vue'

const props = defineProps<{
	uuid: string
}>()

const router = useRouter()

const model = ref<t.Model_t>()
const pods = ref<t.Pod_t[]>([])
const orbs = ref<t.Orb_t[]>([])

onMounted(async () => {
	await updateView()
})

async function updateView() {
	const { models: modelsRes } = await api.core.modelList.query({
		uuid: props.uuid,
	})
	const { pods: podsRes } = await api.core.podList.query({
		model: {
			uuid: props.uuid,
		},
	})
	const { orbs: orbsRes } = await api.core.orbList.query({
		model: {
			uuid: props.uuid,
		},
	})

	model.value = modelsRes[0]
	pods.value = podsRes
	orbs.value = orbsRes
}

// popup: pod create
const boolPodCreate = ref(false)
const dataPodCreate = reactive({ modelUuid: '' })
function showPodCreatePopup() {
	dataPodCreate.modelUuid = model.value?.uuid
	boolPodCreate.value = true
}
async function afterPodCreate() {
	boolPodCreate.value = false
}

// popup: pod edit metadata
const boolPodEditMetadata = ref(false)
const dataPodEditMetadata = reactive<{
	uuid: string
	name: string
	description: string
	tags: string[]
}>({
	uuid: '',
	name: '',
	description: '',
	tags: [],
})
function podEditMetaData(
	uuid: string,
	name: string,
	description: string,
	tags: string[],
) {
	dataPodEditMetadata.uuid = uuid ?? ''
	dataPodEditMetadata.name = name ?? ''
	dataPodEditMetadata.description = description ?? ''
	dataPodEditMetadata.tags = tags ?? []
	boolPodEditMetadata.value = true
}
async function afterPodEditMetadata() {
	boolPodEditMetadata.value = false
	await updateView()
}
</script>
