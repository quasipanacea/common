<template>
	<ul>
		<li v-for="view in currentViews">
			<router-link :to="'/view/' + view.uuid">{{ view.name }}</router-link>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import type * as t from '@quasipanacea/common/types.js'
import { apiObj as api } from '@quasipanacea/common/trpcClient'

const currentViews = ref<null | t.Group_t[]>()
onMounted(async () => {
	const route = useRoute()
	function getUuid(): string {
		const uuid = route.params.groupUuid
		if (!uuid) throw new Error('uuid must be defined')
		if (Array.isArray(uuid)) throw new Error('uuid must not be an array')
		return uuid
	}
	const uuid = getUuid()

	const { views } = await api.core.viewList.query()
	currentViews.value = views.filter((view) => view.groupUuid === uuid)
})
</script>
