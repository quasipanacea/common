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
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import CodeMirror from '@quasipanacea/plugin-components/CodeMirror.vue'
import 'katex/dist/katex.min.css'

import SemanticInputOutput from '@quasipanacea/plugin-components/SemanticInputOutput.vue'
import GoldenLayoutVue, {
	type CustomLayoutConfig,
} from '@quasipanacea/plugin-components/GoldenLayoutVue.vue'
import 'github-markdown-css/github-markdown-light.css'

import * as convert from '@quasipanacea/plugin-utility/convert'
import { useApi3 } from '@quasipanacea/common/trpcClient.js'

import 'katex/dist/contrib/mhchem'
import type { InferenceOnlyAppRouter } from './s'

const api = useApi3<InferenceOnlyAppRouter>()

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

const goldenLayoutConfig: CustomLayoutConfig = {
	root: {
		type: 'row',
		// @ts-expect-error
		content: [
			{
				type: 'component',
				componentType: 'ComponentA',
				componentState: { text: 'Component 1' },
				size: '50%',
				factoryFn(container, state) {
					container.setTitle('Left')
				},
			},
			{
				type: 'component',
				componentType: 'ComponentB',
				componentState: { text: 'Component 2' },
				factoryFn(container, state) {
					container.setTitle('Right')
				},
			},
		],
	},
}

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
	const result = await api.plugins.pods.markdown.read.query({
		uuid: uuid,
	})
	inputCode.value = result.content
	outputHtml.value = await convert.markdownToHtml(inputCode.value)
}

async function markdownWrite(text: string): Promise<void> {
	if (text) {
		await api.plugins.pods.markdown.write.mutate({
			uuid: uuid,
			content: text,
		})
	}
	outputHtml.value = await convert.markdownToHtml(text)
}
</script>
