<template>
	<PodMarkdown v-if="type === 'markdown'" />
	<PodPlaintext v-else-if="type === 'plaintext'" />
	<p v-else>PodWorkaround Error</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import PodMarkdown from '../../common/plugins/Core/PodMarkdown/client-web/PodView.vue'
import PodPlaintext from '../../common/plugins/Core/PodPlaintext/client-web/PodView.vue'

export default defineComponent({
	props: {
		type: String,
	},
	components: {
		PodMarkdown,
		PodPlaintext,
	},
})
</script>
