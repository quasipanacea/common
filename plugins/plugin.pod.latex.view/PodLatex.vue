<template>
	<SemanticInputOutput>
		<template #input>
			<CodeMirror :content="inputCode" @contentUpdate="updateData" />
		</template>
		<template #output>
			<iframe
				ref="iframeEl"
				style="width: 100%; height: 100%"
				:src="iframeSrc"
			></iframe>
		</template>
	</SemanticInputOutput>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { trpcClient } from '@quasipanacea/common/client/index.js'
import {
	CodeMirror,
	SemanticInputOutput,
} from '@quasipanacea/common/components/index.js'
import type { PluginAppRouter } from '@quasipanacea/plugin.pod.latex.controller/shared/s.ts'

const api = trpcClient.yieldClient<PluginAppRouter>()

const route = useRoute()
function getUuid(): string {
	const uuid = route.params.podUuid
	if (!uuid) throw new Error('uuid must be defined')
	if (Array.isArray(uuid)) throw new Error('uuid must not be an array')
	return uuid
}
const uuid = getUuid()

const iframeEl = ref<null | HTMLIFrameElement>(null)
const iframeSrc = ref(`/api/plugins/pod/latex/get-pdf/${uuid}`)

const inputCode = ref('')
onMounted(async () => {
	const result = await api.plugins.pod.latex.read.query({
		uuid,
	})
	inputCode.value = result.content
})
async function updateData(text: string) {
	await api.plugins.pod.latex.write.mutate({
		uuid,
		content: text,
	})

	iframeEl.value!.src += ''
}
</script>
