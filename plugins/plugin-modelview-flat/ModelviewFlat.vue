<template>
	<div>
		<div class="m-3">
			<h1 class="title" style="margin-block-end: 0">{{ model?.name }}</h1>
			<button class="button" @click="router.back()">Back</button>

			<h2 class="title mb-1">Views</h2>
			<button class="button" @click="showViewCreatePopup">New</button>

			<h2 class="title mb-1">Pods</h2>
			<button class="button" @click="handlePopupPodCreate">New</button>
			<div class="columns is-multiline">
				<div v-for="pod of pods" :key="pod.uuid" class="column is-one-quarter">
					<div class="card">
						<div class="card-content">
							<div class="media">
								<div class="media-content">
									<p class="title is-3">{{ pod.name }}</p>
									<p class="subtitle is-6">%{{ pod.plugin }}</p>
								</div>
							</div>
							<div class="content">
								<template v-if="pod.extra?.['model.flat']?.description">
									{{ pod.extra['model.flat'].description }}
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
									handlePopupPodEditMetadata(
										pod.uuid,
										pod.name,
										pod.extra?.['model.flat']?.description || '',
										pod.extra?.['model.flat']?.tags
											? pod.extra?.['model.flat'].tags
											: [],
									)
								"
								>Edit Metadata</a
							>
						</footer>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { t } from '@quasipanacea/common/index.ts'
import {
	popup,
	trpcClient,
	type BareAppRouter,
} from '@quasipanacea/common/client/index.js'

import {
	PodCreatePopup,
	ViewCreatePopup,
} from '@quasipanacea/common/components/index.js'
import PodEditMetadataPopup from './util/PodEditMetadataPopup.vue'

const props = defineProps<{
	uuid: string
}>()

const router = useRouter()
const api = trpcClient.yieldClient<BareAppRouter>()

const model = ref<t.Model_t>()
const pods = ref<t.Pod_t[]>([])

type myType = t.Foo.PodExtras['a']
onMounted(async () => {
	await updateData()
})

async function updateData() {
	const { models: modelsRes } = await api.core.modelList.query({
		uuid: props.uuid,
	})
	const { pods: podsRes } = await api.core.podList.query({
		model: {
			uuid: props.uuid,
		},
	})

	model.value = modelsRes[0]
	pods.value = podsRes
}

async function handlePopupPodCreate() {
	await popup.show('pod-create-3', PodCreatePopup, {
		modelUuid: model.value?.uuid || '',
	})
	await updateData()
}

async function handlePopupPodEditMetadata(
	uuid: string,
	name: string,
	description: string,
	tags: string[],
) {
	await popup.show(
		'plugin-model-flat-pod-edit-metadata',
		PodEditMetadataPopup,
		{
			uuid,
			name,
			description,
			tags,
		},
	)

	await updateData()
}

async function showViewCreatePopup() {
	await popup.show('view-create', ViewCreatePopup, {
		modelUuid: props.uuid,
	})
	await updateData()
}
</script>
