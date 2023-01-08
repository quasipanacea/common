<template>
	<PodMarkdown v-if="handler === 'markdown'" />
	<PodPlaintext v-else-if="handler === 'plaintext'" />
	<p v-else>PodWorkaround Error</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import PodMarkdown from '../../common/plugins/Core/pod-markdown/client-web/PodView.vue'
import PodPlaintext from '../../common/plugins/Core/pod-plaintext/client-web/PodView.vue'

export default defineComponent({
	props: {
		handler: String,
	},
	setup(props) {
		return {
			handler: props.handler,
		}
	},
	components: {
		PodMarkdown,
		PodPlaintext,
	},
})
</script>
