<template>
	<div class="grid">
		<slot name="input"></slot>

		<div ref="gutterEl" class="gutter-col gutter-col-1"></div>

		<slot name="output"></slot>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Split from 'split-grid'

const gutterEl = ref<HTMLElement>()
onMounted(() => {
	Split({
		columnGutters: [
			{
				track: 1,
				element: gutterEl.value!,
			},
		],
	})
})
</script>

<style scoped>
.grid {
	display: grid;
	grid-template-columns: 1fr 10px 1fr;
	height: 200px;
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
