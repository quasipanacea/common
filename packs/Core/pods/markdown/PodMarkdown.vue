<template>
	<div style="display: flex; flex-direction: row">
		<codemirror
			style="flex: 40%"
			v-model="documentText"
			:extensions="mirrorExtensions"
			@ready="mirrorReady"
			@keydown="saveOnCtrlS"
		/>
		<div style="flex: 50%" class="markdown-body" v-html="mdHtml"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Codemirror } from 'vue-codemirror'
import { markdown as mirrorMarkdown } from '@codemirror/lang-markdown'
import { debounce } from 'lodash'
import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { gfmTable, gfmTableHtml } from 'micromark-extension-gfm-table'
import { math, mathHtml } from 'micromark-extension-math'
import { unified } from 'unified'
import { remark } from 'remark'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import 'github-markdown-css/github-markdown-light.css'

import { api } from '@/util/api'
import PodCodemirror from '../../../../util/PodCodemirror.vue'

let uuid = ref('')

const documentText = ref('')

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
const mirrorExtensions = [mirrorMarkdown() as any]
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
		.use(rehypeStringify)
		.process(value)
	mdHtml.value = String(file)
})

// Generic
async function onRead(): Promise<string> {
	const result = await api.plugins.pods.markdown.read.query({
		uuid: uuid.value,
	})
	return result.content
}
async function onWrite(text: string): Promise<void> {
	await api.plugins.pods.markdown.write.mutate({
		uuid: uuid.value,
		content: text,
	})
}
async function onOpen(): Promise<void> {
	await api.plugins.pods.markdown.open.mutate({
		uuid: uuid.value,
	})
}
</script>
