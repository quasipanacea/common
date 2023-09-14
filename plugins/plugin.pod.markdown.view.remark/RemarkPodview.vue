<template>
	<SemanticInputOutput>
		<template #input>
			<CodeMirror :content="inputCode" @contentUpdate="markdownWrite" />
		</template>
		<template #output>
			<div class="markdown-body" v-html="outputHtml"></div>
		</template>
	</SemanticInputOutput>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import 'katex/dist/katex.min.css'
import 'katex/dist/contrib/mhchem'
import 'github-markdown-css/github-markdown-light.css'

import { trpcClient } from '@quasipanacea/common/client/index.js'
import {
	SemanticInputOutput,
	CodeMirror,
} from '@quasipanacea/common/components/index.js'
import { convert } from '@quasipanacea/plugin-utility/client/index.ts'
import type { PluginAppRouter } from '@quasipanacea/plugin.pod.markdown.controller/shared/s.ts'

const api = trpcClient.yieldClient<PluginAppRouter>()

const route = useRoute()
function getUuid(): string {
	const uuid = route.params.podUuid
	if (!uuid) throw new Error('uuid must be defined')
	if (Array.isArray(uuid)) throw new Error('uuid must not be an array')
	return uuid
}
const uuid = getUuid()

const inputCode = ref('')
const outputHtml = ref('')

const n = setInterval(async () => {
	await markdownRead()
}, 5000)
onMounted(async () => {
	await markdownRead()
})
onUnmounted(() => {
	clearTimeout(n)
})

async function markdownRead(): Promise<void> {
	const result = await api.plugins.pod.markdown.read.query({
		uuid: uuid,
	})
	inputCode.value = result.content
	outputHtml.value = await convert.markdownToHtml(inputCode.value)
}

async function markdownWrite(text: string): Promise<void> {
	if (text) {
		await api.plugins.pod.markdown.write.mutate({
			uuid: uuid,
			content: text,
		})
	}
	outputHtml.value = await convert.markdownToHtml(text)
}
</script>
