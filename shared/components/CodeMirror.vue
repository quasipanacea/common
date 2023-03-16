<template>
	<div class="container">
		<VueCodeMirror
			v-model="documentText"
			:extensions="mirrorExtensions"
			@ready="mirrorReady"
			@keydown="saveOnCtrlS"
		/>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, onUnmounted } from 'vue'

import { debounce } from 'lodash'
import { markdown as mirrorMarkdown } from '@codemirror/lang-markdown'
import { Codemirror as VueCodeMirror } from 'vue-codemirror'
import { basicLight } from 'cm6-theme-basic-light'

const emit = defineEmits(['change'])
const { onRead, onWrite, onOpen } = defineProps<{
	onRead?: () => Promise<string>
	onWrite?: (text: string) => Promise<void>
	onOpen?: () => Promise<void>
}>()

const documentText = ref('')

const saveOnType = debounce(async () => {
	if (onWrite) {
		await onWrite(documentText.value)
	}
	emit('change', documentText.value)
}, 300)

async function saveOnCtrlS(ev: KeyboardEvent) {
	if (ev.ctrlKey && ev.code === 'KeyS') {
		ev.preventDefault()
		if (onWrite) {
			await onWrite(documentText.value)
		}
	} else if (ev.ctrlKey && ev.code === 'KeyO') {
		ev.preventDefault()
		if (onOpen) {
			await onOpen()
		}
	}
}

onMounted(async () => {
	document.addEventListener('keydown', saveOnType)

	if (onRead) {
		const obj = await onRead()
		documentText.value = obj
	}
})
onUnmounted(() => {
	document.removeEventListener('keydown', saveOnType)
})

// CodeMirror
const mirrorExtensions = [mirrorMarkdown() as any, basicLight]
const view = shallowRef()
const mirrorReady = (payload: any) => {
	view.value = payload.view
}
</script>
