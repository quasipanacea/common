<template>
	<SemanticInputOutput>
		<template #input>
			<CodeMirror @change="onChange" />
		</template>
		<template #output>
			<svg ref="svgRef" style="width: 100%; height: 100%"></svg>
		</template>
	</SemanticInputOutput>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, nextTick, watch } from 'vue'

import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'

import {
	SemanticInputOutput,
	CodeMirror,
} from '@quasipanacea/common/components/index.js'

const transformer = new Transformer()

const svgRef = ref()
const markdown = ref(`# markmap

- beautiful
- useful
- easy
- interactive
`)
let mm: any

const updateData = () => {
	const { root } = transformer.transform(markdown.value)
	mm.setData(root)
	mm.fit()
}
watch(markdown, updateData)
function onChange(text: string) {
	markdown.value = text
	updateData()
}
onMounted(async () => {
	await nextTick()
	mm = Markmap.create(svgRef.value)
	updateData()
})
onUpdated(updateData)
</script>
