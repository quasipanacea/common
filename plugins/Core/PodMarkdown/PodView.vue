<template>
	<div class="container">
		<header class="header">
			<h1 class="title">Document</h1>
			<router-link to="/overview/OverviewExperimentalPod">Back</router-link>
		</header>
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
	components: {
		Codemirror,
	},
	setup() {
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

		// async function ss(ev: KeyboardEvent) {
		// 	if (ev.ctrlKey && ev.code == 'KeyS') {
		// 		ev.preventDefault()
		// 		await saveDocument()
		// 	}
		// }
		// onMounted(async () => {
		// 	document.addEventListener('keydown', ss)

		// 	const documentId = route.fullPath.split('/').at(-1)
		// 	if (!documentId) throw new Error('documentId is undefined')

		// 	let json
		// 	if (q.area && q.topic && q.note) {
		// 		json = await api.noteRead({
		// 			area: q.area as string,
		// 			topic: q.topic as string,
		// 			name: q.note as string,
		// 		})
		// 	} else {
		// 		throw new Error('not all query parameters exist')
		// 	}
		// 	if (!json) return

		// 	documentText.value = json.content
		// })
		// onUnmounted(() => {
		// 	document.removeEventListener('keydown', ss)
		// })

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
