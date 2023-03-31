<template>
	<ul>
		<li v-for="cover in currentCovers">
			<router-link :to="'/cover/' + cover.uuid">{{ cover.name }}</router-link>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import type * as t from '@quasipanacea/common/types.js'
import { apiObj as api } from '@quasipanacea/common/trpcClient.ts'

const currentCovers = ref<null | t.Group_t[]>()
onMounted(async () => {
	const route = useRoute()
	function getUuid(): string {
		const uuid = route.params.groupUuid
		if (!uuid) throw new Error('uuid must be defined')
		if (Array.isArray(uuid)) throw new Error('uuid must not be an array')
		return uuid
	}
	const uuid = getUuid()

	const { covers } = await api.core.coverList.query()
	currentCovers.value = covers.filter((cover) => cover.groupUuid === uuid)
})
</script>
