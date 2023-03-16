<template>
	<GoldenLayoutVue :layoutConfig="goldenLayoutConfig">
		<template #ComponentA>
			<CodeMirror :onRead="onRead" :onWrite="onWrite" />
		</template>
		<template #ComponentB>
			<div class="markdown-body" v-html="mdHtml"></div>
		</template>
	</GoldenLayoutVue>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import CodeMirror from '@common/shared/components/CodeMirror.vue'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypeKatex from 'rehype-katex'
import rehypeExternalLinks from 'rehype-external-links'

import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import 'katex/dist/katex.min.css'

import GoldenLayoutVue, {
	type CustomLayoutConfig,
} from '@common/shared/components/GoldenLayoutVue.vue'
import 'github-markdown-css/github-markdown-light.css'

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

const mdHtml = ref('')

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

async function convertMarkdownToHtml(input: string) {
	const output = await unified()
		.use(remarkToc)
		.use(remarkParse)
		.use(remarkMath)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeKatex)
		.use(rehypeExternalLinks, { target: '__blank', rel: 'nofollow ' })
		.use(rehypeStringify)
		.process(input)

	return String(output)
}
onMounted(async () => {
	const result = await api.plugins.pods.markdown.read.query({
		uuid: uuid,
	})
	mdHtml.value = await convertMarkdownToHtml(result.content)
})

async function onRead(): Promise<string> {
	const result = await api.plugins.pods.markdown.read.query({
		uuid: uuid,
	})
	return result.content
}
async function onWrite(text: string): Promise<void> {
	await api.plugins.pods.markdown.write.mutate({
		uuid: uuid,
		content: text,
	})

	mdHtml.value = await convertMarkdownToHtml(text)
}
</script>
