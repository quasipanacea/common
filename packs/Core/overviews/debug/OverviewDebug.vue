<template>
	<pre>{{ str }}</pre>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import { api } from '@/util/api'

export default defineComponent({
	setup() {
		const str = ref('')

		onMounted(async () => {
			const result = await api.podList.query()
			str.value = JSON.stringify(result.pods, null, '\t')
		})

		return {
			str,
		}
	},
})
</script>
