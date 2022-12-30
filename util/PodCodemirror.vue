<template>
	<div class="container">
		<!-- <codemirror
			v-model="documentText"
			:extensions="mirrorExtensions"
			@ready="mirrorReady"
			@keydown="saveDocument()"
		/> -->
	</div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, shallowRef, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { debounce } from 'lodash'
import * as api from '@/util/clientApiV2'
import { EditorState } from '@codemirror/state'
import { markdown as mirrorMarkdown } from '@codemirror/lang-markdown'
import { Codemirror } from 'vue-codemirror'

export default defineComponent({
	props: {
		onRead: {
			type: Function,
			required: true,
		},
		onWrite: {
			type: Function,
			required: true,
		},
	},
	components: {
		Codemirror,
	},
	setup({ onRead, onWrite }) {
		const route = useRoute()
		const q = route.query

		const documentText = ref('')

		// const saveDocument = debounce(async () => {
		// 	if (q.area && q.topic && q.note) {
		// 		await api.noteWrite({
		// 			area: q.area as string,
		// 			topic: q.topic as string,
		// 			name: q.note as string,
		// 			content: documentText.value,
		// 		})
		// 	} else {
		// 		throw new Error('not all query parameters exist')
		// 	}
		// }, 300)

		async function saveDocument(ev: KeyboardEvent) {
			if (ev.ctrlKey && ev.code == 'KeyS') {
				ev.preventDefault()
				// await saveDocument()
			}
		}
		onMounted(async () => {
			document.addEventListener('keydown', saveDocument)

			const podUuid = route.fullPath.split('/').at(-1)
			if (!podUuid) throw new Error('podUuid is undefined')

			const content = await onRead()
			if (!content) return

			documentText.value = content
		})
		onUnmounted(() => {
			document.removeEventListener('keydown', saveDocument)
		})

		// // CodeMirror
		// const mirrorExtensions = [mirrorMarkdown()]
		// const view = shallowRef()
		// const mirrorReady = (payload: any) => {
		// 	view.value = payload.view
		// }

		// return {
		// 	documentText,
		// 	saveDocument,
		// 	mirrorExtensions,
		// 	mirrorReady,
		// }
	},
})
</script>

<style scoped></style>
