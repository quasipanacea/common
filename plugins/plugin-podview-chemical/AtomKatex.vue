<template>
	<div style="display: grid; grid-template-columns: 1fr 1fr; min-height: 100px">
		<div>
			<CodeMirror :content="inputCode" @contentUpdate="codeUpdate" />
		</div>
		<div>
			<div class=":katex-output" ref="outputEl"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import katex from 'katex'
import 'katex/dist/contrib/mhchem'
import 'katex/dist/katex.min.css'

import { CodeMirror } from '@quasipanacea/common/components/index.js'

const inputCode = ref('c = \\pm\\sqrt{a^2 + b^2}')
const outputEl = ref<HTMLElement>()
function codeUpdate(text: string) {
	katex.render(text, outputEl.value!, {
		throwOnError: false,
	})
}
onMounted(() => {
	codeUpdate(inputCode.value)
})
</script>
