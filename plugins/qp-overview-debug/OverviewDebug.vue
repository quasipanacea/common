<template>
	<pre>{{ str }}</pre>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useApi3, type BareAppRouter } from '@quasipanacea/common/client/trpcClient.ts'

const api = useApi3<BareAppRouter>()

const str = ref('')

onMounted(async () => {
	const result = await api.core.podList.query()
	str.value = JSON.stringify(result.pods, null, '\t')
})
</script>
