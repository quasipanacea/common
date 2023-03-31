<template>
	<dialog
		:open="show"
		class="dialog"
		style="
			--space: 250px;
			position: fixed;
			top: var(--space);
			left: var(--space);
			width: calc(100% - (2 * var(--space)));
			height: calc(100% - (2 * var(--space)));
			padding: 10px;
			border-radius: 5px;
			background-color: var(--oc-gray-1);
			box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1),
				0px 10px 15px -3px rgba(0, 0, 0, 0.1),
				0px 10px 15px -3px rgba(0, 0, 0, 0.1);
		"
	>
		<div
			style="
				position: absolute;
				top: -50px;
				left: 0;
				box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1),
					0px 10px 15px -3px rgba(0, 0, 0, 0.1);
			"
		>
			<button class="pure-button pure-button-primary" @click="$emit('cancel')">
				Close
			</button>
		</div>
		<slot />
	</dialog>
</template>

<script setup lang="ts">
defineProps<{
	show: boolean
}>()
defineEmits(['cancel'])
</script>
