<template>
	<GoldenLayoutVue :layoutConfig="goldenLayoutConfig">
		<template #ComponentA>
			<CodeMirror :content="inputCode" @contentUpdate="codeUpdate" />
		</template>
		<template #ComponentB>
			<div class="markdown-body" v-html="outputHtml"></div>
		</template>
	</GoldenLayoutVue>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import CodeMirror from '@quasipanacea/plugin-components/CodeMirror.vue'
import 'katex/dist/katex.min.css'

import GoldenLayoutVue, {
	type CustomLayoutConfig,
} from '@quasipanacea/plugin-components/GoldenLayoutVue.vue'
import 'github-markdown-css/github-markdown-light.css'

import { apiObj } from '@quasipanacea/common/trpcClient'
import * as convert from '@quasipanacea/plugin-utility/convert'
import { useApi } from '@quasipanacea/plugin-utility/c'

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

onMounted(async () => {
	const result = await api.plugins.pods.markdown.read.query({
		uuid: uuid,
	})
	inputCode.value = result.content

	outputHtml.value = await convert.markdownToHtml(inputCode.value)
})

//
async function codeUpdate(text: string): Promise<void> {
	if (text) {
		await api.plugins.pods.markdown.write.mutate({
			uuid: uuid,
			content: text,
		})
	}
	outputHtml.value = await convert.markdownToHtml(text)
}
</script>
