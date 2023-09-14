<template>
	<div
		@click="flipCard"
		style="
			aspect-ratio: 3/2;
			background-color: bisque;
			border-radius: 3px;
			position: relative;
		"
	>
		<div
			:style="{ visibility: isFrontVisibility }"
			style="
				position: absolute;
				inset: 0;
				display: flex;
				align-items: center;
				justify-content: center;
			"
		>
			<slot name="front"></slot>
		</div>
		<div
			:style="{ visibility: isBackVisibility }"
			style="
				position: absolute;
				inset: 0;
				display: flex;
				align-items: center;
				justify-content: center;
			"
		>
			<slot name="back"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Property } from 'csstype'

const isFrontVisibility = ref<Property.Visibility>('visible')
const isBackVisibility = ref<Property.Visibility>('hidden')
function flipCard() {
	for (const reference of [isFrontVisibility, isBackVisibility]) {
		if (reference.value === 'visible') {
			reference.value = 'hidden'
		} else if (reference.value === 'hidden') {
			reference.value = 'visible'
		}
	}
}
</script>
