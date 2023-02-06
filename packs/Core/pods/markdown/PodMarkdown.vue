<template>
	<div class="container">
		<PodCodemirror :onRead="onRead" :onWrite="onWrite" :onOpen="onOpen" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import PodCodemirror from '../../../../util/PodCodemirror.vue'

export default defineComponent({
	setup() {
		const route = useRoute()
		const uuid = route.params.uuid

		return {
			async onRead(): Promise<string> {
				const text = await fetch('/api/v2/pod/plugin/markdown/read', {
					method: 'POST',
					body: JSON.stringify({
						uuid,
					}),
				})
				const json = await text.json()
				return json
			},
			async onWrite(text: string): Promise<void> {
				await fetch('/api/v2/pod/plugin/markdown/write', {
					method: 'POST',
					body: JSON.stringify({
						uuid,
						content: text,
					}),
				})
			},
			async onOpen(): Promise<void> {
				await fetch('/api/v2/pod/plugin/markdown/open', {
					method: 'POST',
					body: JSON.stringify({ uuid }),
				})
			},
		}
	},
	components: {
		PodCodemirror,
	},
})
</script>
