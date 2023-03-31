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
import { Markmap } from 'markmap-view/dist/index.esm'

import SemanticInputOutput from '@quazipanacea/common-components/SemanticInputOutput.vue'
import CodeMirror from '@quazipanacea/common-components/CodeMirror.vue'

const transformer = new Transformer()

const svgRef = ref()
const markdown = ref(`# markmap

- beautiful
- useful
- easy
- interactive
`)
let mm

const update = () => {
	const { root } = transformer.transform(markdown.value)
	mm.setData(root)
	mm.fit()
}
watch(markdown, update)
function onChange(text: string) {
	markdown.value = text
	update()
}
onMounted(async () => {
	await nextTick()
	mm = Markmap.create(svgRef.value)
	update()
})
onUpdated(update)
</script>
