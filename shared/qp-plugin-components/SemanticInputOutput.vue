<template>
	<GoldenLayoutVue :layoutConfig="goldenLayoutConfig">
		<template #ComponentA>
			<slot name="input"> </slot>
		</template>
		<template #ComponentB>
			<slot name="output"> </slot>
		</template>
	</GoldenLayoutVue>
</template>

<script setup lang="ts">
import GoldenLayoutVue, { type CustomLayoutConfig } from './GoldenLayoutVue.vue'
import 'github-markdown-css/github-markdown-light.css'

const goldenLayoutConfig: CustomLayoutConfig = {
	root: {
		type: 'row',
		// @ts-expect-error
		content: [
			{
				type: 'component',
				componentType: 'ComponentA',
				componentState: { text: 'Component 1' },
				size: '50%',
				factoryFn(container, state) {
					container.setTitle('Left')
				},
			},
			{
				type: 'component',
				componentType: 'ComponentB',
				componentState: { text: 'Component 2' },
				factoryFn(container, state) {
					container.setTitle('Right')
				},
			},
		],
	},
}
</script>
