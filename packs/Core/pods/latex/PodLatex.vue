<template>
	<SemanticInputOutput>
		<template #input>
			<codemirror
				v-model="documentText"
				:extensions="mirrorExtensions"
				@ready="mirrorReady"
				@keydown="saveOnCtrlS"
			/>
		</template>
		<template #output>
			<iframe
				id="if"
				style="width: 100%; height: 100%"
				src="/api/plugins/pod/latex/get-pdf/413456e5-967a-40ab-aa62-c46bfb7a73dc"
			></iframe>
		</template>
	</SemanticInputOutput>
</template>

<script setup lang="ts">
import { onMounted, defineComponent, ref, shallowRef, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from 'lodash'
import { markdown as mirrorMarkdown } from '@codemirror/lang-markdown'
import { Codemirror } from 'vue-codemirror'

import 'pdfjs-dist/web/pdf_viewer.css'
import SemanticInputOutput from '@common/shared/components/SemanticInputOutput.vue'
import { apiObj } from '@/util/api'
import { useApi } from '@common/shared/util/c'
import type { InferenceOnlyApi } from './c'

const api = useApi<InferenceOnlyApi>(apiObj)

const route = useRoute()

// CodeMirror
const mirrorExtensions = [mirrorMarkdown() as any]
const view = shallowRef()
const mirrorReady = (payload: any) => {
	view.value = payload.view
}

const documentText = ref('')

const saveOnType = debounce(async () => {
	await onWrite(documentText.value)
}, 300)

async function saveOnCtrlS(ev: KeyboardEvent) {
	if (ev.ctrlKey && ev.code === 'KeyS') {
		ev.preventDefault()
		await onWrite(documentText.value)
	} else if (ev.ctrlKey && ev.code === 'KeyO') {
		ev.preventDefault()
		await onOpen()
	}
}

onMounted(async () => {
	document.addEventListener('keydown', saveOnType)

	const uuid = route.params.uuid
	if (!uuid) throw new Error('podUuid is undefined')

	const obj = await onRead()
	documentText.value = obj
})
onUnmounted(() => {
	document.removeEventListener('keydown', saveOnType)
})

let uuid = ref('')
// const route = useRoute()

const u = route.params.uuid
if (!u) throw new Error('uuid must be defined')
if (Array.isArray(u)) throw new Error('uuid must not be an array')
uuid.value = u

async function onRead() {
	const result = await api.plugins.pods.latex.read.query({
		uuid: uuid.value,
	})
	return result.content
}
async function onWrite(text: string) {
	await api.plugins.pods.latex.write.mutate({
		uuid: uuid.value,
		content: text,
	})
	const el = document.getElementById('if')
	if (el?.contentWindow) {
		el.contentWindow.location.reload()
	} else {
		el.location.reload()
	}
}
async function onOpen() {}
</script>
