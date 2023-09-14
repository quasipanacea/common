<template>
	<div style="width: 100%; height: 100%">
		<textarea
			class="textarea"
			:placeholder="placeholder"
			v-model="content"
			@keyup="handleKeyup"
		></textarea>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { trpcClient } from '@quasipanacea/common/client/index.js'
import type { PluginAppRouter } from '@quasipanacea/plugin.pod.plaintext.controller/shared/s.ts'

const api = trpcClient.yieldClient<PluginAppRouter>()

const route = useRoute()
function getUuid(): string {
	const uuid = route.params.podUuid
	if (!uuid) throw new Error('uuid must be defined')
	if (Array.isArray(uuid)) throw new Error('uuid must not be an array')
	return uuid
}
const uuid = getUuid()

const placeholder = ref('Loading...')
const content = ref('')
onMounted(async () => {
	const result = await api.plugins.pod.plaintext.read.query({ uuid })
	content.value = result.content
	placeholder.value = ''
})
async function handleKeyup(): Promise<void> {
	await api.plugins.pod.plaintext.write.mutate({
		uuid,
		content: content.value,
	})
}
</script>
