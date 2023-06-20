<template>
	<div style="height: 100%; display: grid; grid-template-columns: 1fr 1fr">
		<div style="position: relative; height: 100%; width: 100%">
			<div style="position: absolute; inset: 0; overflow: auto">
				<slot name="input"> </slot>
			</div>
		</div>

		<div style="position: relative; height: 100%; width: 100%">
			<div style="position: absolute; inset: 0; overflow: auto">
				<slot name="output"> </slot>
			</div>
		</div>
	</div>
	<!-- <GoldenLayoutVue :layoutConfig="goldenLayoutConfig">
		<template #ComponentA>
			<slot name="input"> </slot>
		</template>
		<template #ComponentB>
			<slot name="output"> </slot>
		</template>
	</GoldenLayoutVue> -->
</template>

<script setup lang="ts">
// import GoldenLayoutVue, { type CustomLayoutConfig } from './GoldenLayoutVue.vue'

// const goldenLayoutConfig: CustomLayoutConfig = {
// 	root: {
// 		type: 'row',
// 		// @ts-expect-error
// 		content: [
// 			{
// 				type: 'component',
// 				componentType: 'ComponentA',
// 				componentState: { text: 'Component 1' },
// 				size: '50%',
// 				factoryFn(container, state) {
// 					container.setTitle('Left')
// 				},
// 			},
// 			{
// 				type: 'component',
// 				componentType: 'ComponentB',
// 				componentState: { text: 'Component 2' },
// 				factoryFn(container, state) {
// 					container.setTitle('Right')
// 				},
// 			},
// 		],
// 	},
// }
</script>
