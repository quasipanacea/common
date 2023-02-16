<template>
	<div class="container">
		<PodCodemirror :onRead="onRead" :onWrite="onWrite" :onOpen="onOpen" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

import { api } from '@/util/api'
import PodCodemirror from '../../../../util/PodCodemirror.vue'

export default defineComponent({
	setup() {
		const route = useRoute()
		const uuid = route.params.uuid
		if (Array.isArray(uuid)) throw new TypeError('Should not be array')

		return {
			async onRead(): Promise<string> {
				const result = await api.plugins.pods.plaintext.read.query({ uuid })
				return result.content
			},
			async onWrite(text: string): Promise<void> {
				await api.plugins.pods.plaintext.write.mutate({
					uuid,
					content: text,
				})
			},
			async onOpen(): Promise<void> {
				await api.plugins.pods.plaintext.open.mutate({
					uuid,
				})
			},
		}
	},
	components: {
		PodCodemirror,
	},
})
</script>
