<template>
	<div class=":context-event-wrapper" @contextmenu="handleContextMenu">
		<slot />
	</div>
	<!-- <div
		class=":context-menu"
		:style="{ visibility: contextVisible ? 'visible' : 'hidden' }"
		style="
			--margin: 5px;
			position: absolute;
			top: var(--margin);
			left: var(--margin);
			right: var(--margin);
			bottom: var(--margin);
		"
		@contextmenu="handleContextMenu"
	>
		<div
			style="
				border-radius: 5px;
				padding: 5px;
				height: 100%;
				background-color: antiquewhite;
			"
		>
			<slot name="configuration" />
		</div>
	</div> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'

let contextVisible = ref(false)

function handleContextMenu(ev: MouseEvent) {
	if (ev.altKey) {
		contextVisible.value = !contextVisible.value
		ev.preventDefault()
	}
}
</script>
