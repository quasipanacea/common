<template>
	<div>
		<span class="menu">
			<ul class="pure-menu pure-menu-horizontal pure-menu-active-hover">
				<li class="pure-menu-item">
					<a class="pure-menu-link" @click="popupNewPod">New Pod</a>
				</li>
			</ul>
		</span>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { api } from '@/util/api'
import type * as t from '@common/types'

export default defineComponent({
	setup() {
		const podPlugins = ref<t.Plugin_t[]>([])

		async function gen() {
			const result = await api.pluginList.query()

			podPlugins.value = result.plugins
			// for (const plugin of result.plugins) {
			// 	const { pods } = await tc.podList.query()
			// }
			console.log(result)
		}

		;(async () => {
			await gen()
		})()

		return {
			popupNewPod() {},
			podPlugins,
		}
	},
	components: { RouterLink },
})
</script>

<style scoped>
.menu {
	position: absolute;
	top: 10px;
	right: 15px;
}

.pod-list {
	margin-inline-start: 10px;
	list-style-type: none;
}

.pod-list > li {
	margin-block-end: 5px;
}
</style>
