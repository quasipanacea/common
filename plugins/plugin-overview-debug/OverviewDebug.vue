<template>
	<pre>{{ str }}</pre>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import {
	trpcClient,
	type BareAppRouter,
} from '@quasipanacea/common/client/index.js'

const api = trpcClient.yieldClient<BareAppRouter>()

const str = ref('')

onMounted(async () => {
	const result = await api.core.podList.query()
	str.value = JSON.stringify(result.pods, null, '\t')
})
</script>
