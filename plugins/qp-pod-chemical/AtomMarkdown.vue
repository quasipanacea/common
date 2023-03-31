<template>
	<div style="display: grid; grid-template-columns: 1fr 1fr; min-height: 100px">
		<CodeMirror :content="inputCode" @contentUpdate="codeUpdate" />
		<div class=":markdown-output markdown-body" ref="outputEl"></div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import 'github-markdown-css/github-markdown-light.css'

import * as convert from '@quasipanacea/plugin-utility/convert'
import CodeMirror from '@quasipanacea/plugin-components/CodeMirror.vue'

const inputCode = ref('# Heading')
const outputEl = ref<HTMLElement>()
async function codeUpdate(text: string) {
	outputEl.value.innerHTML = await convert.markdownToHtml(text)
}
onMounted(() => {
	codeUpdate(inputCode.value)
})
</script>
