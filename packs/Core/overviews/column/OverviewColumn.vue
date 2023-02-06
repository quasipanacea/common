<template>
	<div style="display: flex; flex-direction: row; height: 100%">
		<template v-for="collection of collections" :key="collection">
			<div style="width: 200px; margin: 5px">{{ collection }}</div>
			<div style="border: 1px solid var(--oc-gray-3)"></div>
		</template>
		<div style="min-width: 200px; text-align: center; margin-top: 180px">
			<button class="pure-button pure-button-primary">New Collection</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as api from '@/util/apiv2'

export default defineComponent({
	setup() {
		const collections = ref(['one', 'two', 'three'])

		return {
			collections,
		}
	},
})
</script>
