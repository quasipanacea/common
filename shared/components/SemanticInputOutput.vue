<template>
	<GoldenLayoutVue :layoutConfig="goldenLayoutConfig">
		<template #ComponentA>
			<slot name="input"> </slot>

			<!-- <codemirror
				v-model="documentText"
				placeholder="Loading..."
				:extensions="mirrorExtensions"
				@ready="mirrorReady"
				@keydown="saveOnCtrlS"
			/> -->
		</template>
		<template #ComponentB>
			<!-- <div class="markdown-body" v-html="mdHtml"></div> -->
			<slot name="output"> </slot>
		</template>
	</GoldenLayoutVue>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

import { Codemirror } from 'vue-codemirror'
import { EditorView } from 'codemirror'
import { markdown as mirrorMarkdown } from '@codemirror/lang-markdown'
import { basicLight } from 'cm6-theme-basic-light'
import { debounce } from 'lodash'
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

import { api } from '@/util/api'

let uuid = ref('')

const documentText = ref('')

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
// CodeMirror
onMounted(async () => {
	document.addEventListener('keydown', saveOnType)

	const route = useRoute()
	const u = route.params.uuid
	if (!u) throw new Error('uuid must be defined')
	if (Array.isArray(u)) throw new Error('uuid must not be an array')
	uuid.value = u

	const obj = await onRead()
	documentText.value = obj
})
onUnmounted(() => {
	document.removeEventListener('keydown', saveOnType)
})

const saveOnType = debounce(async () => {
	await onWrite(documentText.value)
}, 300)

// CodeMirror
const mirrorExtensions = [
	EditorView.lineWrapping,
	mirrorMarkdown() as any,
	basicLight,
]
const view = shallowRef()
const mirrorReady = (payload: any) => {
	view.value = payload.view
}
async function saveOnCtrlS(ev: KeyboardEvent) {
	if (ev.ctrlKey && ev.code === 'KeyS') {
		ev.preventDefault()
		await onWrite(documentText.value)
	} else if (ev.ctrlKey && ev.code === 'KeyO') {
		ev.preventDefault()
		await onOpen()
	}
}

// markdown Viewer
const mdHtml = ref('')
watch(documentText, async (value) => {
	const file = await unified()
		.use(remarkToc)
		.use(remarkParse)
		.use(remarkMath)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeKatex)
		.use(rehypeExternalLinks, { target: '__blank', rel: 'nofollow ' })
		.use(rehypeStringify)
		.process(value)
	mdHtml.value = String(file)
})

// Generic
async function onRead(): Promise<string> {
	// const result = await api.plugins.pods.markdown.read.query({
	// 	uuid: uuid.value,
	// })
	// return result.content
}
async function onWrite(text: string): Promise<void> {
	// await api.plugins.pods.markdown.write.mutate({
	// 	uuid: uuid.value,
	// 	content: text,
	// })
}
async function onOpen(): Promise<void> {
	// await api.plugins.pods.markdown.open.mutate({
	// 	uuid: uuid.value,
	// })
}
</script>
