<template>
	<SemanticInputOutput>
		<template #input>
			<MilkdownProvider>
				<ProsemirrorAdapterProvider>
					<MilkdownEditor />
				</ProsemirrorAdapterProvider>
			</MilkdownProvider>
		</template>
		<template #output>
			<div class="markdown-body" v-html="outputHtml"></div>
		</template>
	</SemanticInputOutput>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import { MilkdownProvider, useEditor } from '@milkdown/vue'
import '@milkdown/theme-nord/style.css'

import { useApi3 } from '@quasipanacea/common/client/index.js'
import { SemanticInputOutput } from '@quasipanacea/plugin-components/index.js'
import { convert } from '@quasipanacea/plugin-utility/client/index.ts'

import type { InferenceOnlyAppRouter } from './s'
import './util/style.css'
import MilkdownEditor from './util/MilkdownEditor.vue'

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
