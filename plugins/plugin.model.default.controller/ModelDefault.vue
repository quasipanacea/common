<template>
	<button class="button" @click="router.back()">Back</button>
	<h1 class="title is-3">{{ model?.name }}</h1>
	<div style="border: 1px solid #333">
		<h2 class="subtitle is-4 m-0">Schema</h2>
		<button class="button">New List</button>

		<p>Lists</p>
	</div>

	<p>Current Lists:</p>

	<div class="columns">
		<div class="column">
			<h2 class="subtitle">Pods</h2>
			<ul>
				<li v-for="pod in pods" :key="pod.uuid">
					<router-link :to="`/pod/${pod.uuid}`">{{ pod.name }}</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { t } from '@quasipanacea/common/index.ts'
import {
	trpcClient,
	type BareAppRouter,
} from '@quasipanacea/common/client/index.js'

const props = defineProps<{
	uuid: string
}>()

const router = useRouter()
const api = trpcClient.yieldClient<BareAppRouter>()

const model = ref<t.Model_t>()
const pods = ref<t.Pod_t[]>([])

onMounted(async () => {
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
})
</script>
