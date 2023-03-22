<template>
	<ConfigurableContext>
		<div ref="mirrorEl"></div>
		<template #configuration>
			<h1 class="title">Properties</h1>

			<p>Indent Style</p>
			<div class="select">
				<select v-model="pi.indentStyle">
					<option value="space">Space</option>
					<option value="tab">Tab</option>
				</select>
			</div>

			<p>Indent Size</p>
			<div class="select">
				<select v-model="pi.indentSize">
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="8">8</option>
				</select>
			</div>
		</template>
	</ConfigurableContext>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, reactive, watch, toRef } from 'vue'
import { debounce } from 'lodash'
import { basicSetup } from 'codemirror'
import { indentUnit } from '@codemirror/language'
import { EditorState, Compartment, Facet } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab, defaultKeymap } from '@codemirror/commands'
import { markdown as mirrorMarkdown } from '@codemirror/lang-markdown'
import { basicLight } from 'cm6-theme-basic-light'

import ConfigurableContext from '@common/shared/components/ConfigurableContext.vue'

const emit = defineEmits(['contentUpdate'])
const props = defineProps<{
	content: string
	extensions?: []
}>()

// Properties
const pi = reactive<{ indentStyle: 'space' | 'tab'; indentSize: string }>({
	indentStyle: 'space',
	indentSize: '3',
})

// CodeMirror
const mirrorEl = ref<HTMLElement>()
onMounted(async () => {
	const tabSizeCompartment = new Compartment()
	const indentUnitCompartment = new Compartment()

	let view = new EditorView({
		parent: mirrorEl.value,
		state: EditorState.create({
			doc: props.content,
			extensions: [
				basicSetup,
				basicLight,
				mirrorMarkdown(),

				...(props.extensions || []),

				tabSizeCompartment.of(EditorState.tabSize.of(9)),
				indentUnitCompartment.of(indentUnit.of('\t')),
				keymap.of([indentWithTab]),

				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						const docString = update.state.sliceDoc()
						emit('contentUpdate', docString)
					}
				}),
			],
		}),
	})

	watch(props, (value) => {
		view.dispatch({
			changes: {
				from: 0,
				to: view.state.doc.length,
				insert: value.content,
			},
		})
	})

	watch(pi, (value) => {
		const size = Number(value.indentSize)
		const unit = pi.indentStyle === 'space' ? ' '.repeat(size) : '\t'

		view.dispatch({
			effects: [
				indentUnitCompartment.reconfigure(indentUnit.of(unit)),
				tabSizeCompartment.reconfigure(EditorState.tabSize.of(size)),
			],
		})
	})
})
</script>
