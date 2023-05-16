<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<h2 class="title is-4">Pod: Edit Metadata</h2>
	</PopupComponent>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import { useApi3, type BareAppRouter } from '@quasipanacea/common/trpcClient.js'
import PopupComponent from '@quasipanacea/plugin-components/PopupComponent.vue'

const emit = defineEmits(['cancel', 'submit'])
const props = defineProps<{
	show: boolean
	data: {
		model: {
			uuid: string
		}
	}
}>()

const api = useApi3<BareAppRouter>()

const podPlugins = ref<string[]>([])
onMounted(async () => {
	const { plugins } = await api.core.pluginList.query({ kind: 'pod' })

	podPlugins.value = plugins.map((plugin) => plugin.id)
})
const form = reactive({
	name: '',
	plugin: '',
})

async function sendRequest() {
	emit('submit')
}
</script>
