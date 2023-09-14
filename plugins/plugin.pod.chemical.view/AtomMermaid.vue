<template>
	<div style="display: grid; grid-template-columns: 1fr 1fr; min-height: 100px">
		<div>
			<CodeMirror :content="inputCode" @contentUpdate="codeUpdate" />
		</div>
		<div>
			<div ref="mermaidEl"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import mermaid from 'mermaid'

import { CodeMirror } from '@quasipanacea/common/components/index.js'

const inputCode = ref(`graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
	`)

async function codeUpdate(text: string) {
	await drawDiagram(text)
}

const mermaidEl = ref<HTMLElement>()

onMounted(async () => {
	mermaid.initialize({
		startOnLoad: false,
		securityLevel: 'loose',
		flowchart: { useMaxWidth: false, htmlLabels: true },
	})
	await drawDiagram(inputCode.value)
})

async function drawDiagram(text: string) {
	const { svg } = await mermaid.render('graphDiv', text)
	mermaidEl.value!.innerHTML = svg
}
</script>

<style scoped>
.grid {
	display: grid;
	grid-template-columns: 1fr 10px 1fr;
}

.gutter-col {
	grid-row: 1/-1;
	background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
	cursor: col-resize;
}

.gutter-col-1 {
	grid-column: 2;
}
</style>
