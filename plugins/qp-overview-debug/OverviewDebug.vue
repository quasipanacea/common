<template>
	<pre>{{ str }}</pre>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import { apiObj as api } from '@quasipanacea/common/trpcClient.ts'

export default defineComponent({
	setup() {
		const str = ref('')

		onMounted(async () => {
			const result = await api.core.podList.query()
			str.value = JSON.stringify(result.pods, null, '\t')
		})

		return {
			str,
		}
	},
})
</script>
