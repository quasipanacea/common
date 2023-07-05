<template>
	<div>
		<h2 class="title is-4">Pod: Edit Metadata</h2>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import {
	trpcClient,
	type BareAppRouter,
} from '@quasipanacea/common/client/index.js'

const props = defineProps<{
	model: {
		uuid: string
	}
}>()

const api = trpcClient.yieldClient<BareAppRouter>()

const podPlugins = ref<string[]>([])
onMounted(async () => {
	const { plugins } = await api.core.pluginList.query({ family: 'pod' })

	podPlugins.value = plugins.map((plugin) => plugin.id)
})
const form = reactive({
	name: '',
	plugin: '',
})
</script>
