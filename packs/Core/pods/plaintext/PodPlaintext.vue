<template>
	<div class="container" style="width: 100%; height: 100%">
		<CodeMirror :onRead="onRead" :onWrite="onWrite" />
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import CodeMirror from '@common/shared/components/CodeMirror.vue'
import { apiObj } from '@/util/api'
import { useApi } from '@common/shared/util/c'

import type { InferenceOnlyApi } from './c'

const api = useApi<InferenceOnlyApi>(apiObj)

const route = useRoute()
function getUuid(): string {
	const uuid = route.params.uuid
	if (!uuid) throw new Error('uuid must be defined')
	if (Array.isArray(uuid)) throw new Error('uuid must not be an array')
	return uuid
}
const uuid = getUuid()

async function onRead(): Promise<string> {
	const result = await api.plugins.pods.plaintext.read.query({ uuid })
	return result.content
}
async function onWrite(text: string): Promise<void> {
	await api.plugins.pods.plaintext.write.mutate({
		uuid,
		content: text,
	})
}
</script>
