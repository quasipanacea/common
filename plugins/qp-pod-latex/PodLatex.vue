<template>
	<SemanticInputOutput>
		<template #input>
			<CodeMirror :content="inputCode" @contentUpdate="codeUpdate" />
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

import SemanticInputOutput from '@quazipanacea/plugin-components/SemanticInputOutput.vue'
import CodeMirror from '@quazipanacea/plugin-components/CodeMirror.vue'
import { apiObj } from '@quazipanacea/common/trpcClient.ts'
import { useApi } from '@quazipanacea/plugin-utility/c'
import type { InferenceOnlyApi } from './c'

const api = useApi<InferenceOnlyApi>(apiObj)

const route = useRoute()
function getUuid(): string {
	const uuid = route.params.podUuid
	if (!uuid) throw new Error('uuid must be defined')
	if (Array.isArray(uuid)) throw new Error('uuid must not be an array')
	return uuid
}
const uuid = getUuid()

const iframeEl = ref(null)
const iframeSrc = ref(`/api/plugins/pod/latex/get-pdf/${uuid}`)

const inputCode = ref('')
onMounted(async () => {
	const result = await api.plugins.pods.latex.read.query({
		uuid,
	})
	inputCode.value = result.content
})
async function codeUpdate(text: string) {
	await api.plugins.pods.latex.write.mutate({
		uuid,
		content: text,
	})

	if (iframeEl.value?.contentWindow) {
		iframeEl.value.contentWindow.location.reload()
	} else {
		iframeEl.value.location.reload()
	}
}
</script>
