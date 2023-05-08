<template>
	<dialog
		:open="show"
		class="dialog"
		style="
			position: fixed;
			top: 8vh;
			width: 80vw;
			height: 80vh;
			z-index: 1000;
			padding: 0;
			box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1),
				0px 10px 15px -3px rgba(0, 0, 0, 0.1),
				0px 10px 15px -3px rgba(0, 0, 0, 0.1);
		"
	>
		<div
			style="
				height: 100%;
				margin: 0;
				display: grid;
				grid-template-rows: auto 1fr;
			"
		>
			<div style="margin: 0; padding: 5px; border-bottom: 3px solid black">
				<button class="button is-black" @click="$emit('cancel')">Close</button>
			</div>
			<div style="padding: 16px; margin: 0; overflow: auto">
				<slot />
			</div>
		</div>
	</dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
	show: boolean
}>()
defineEmits(['cancel'])
</script>
