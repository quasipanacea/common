<template>
	<div>
		<span class="menu">
			<ul class="pure-menu pure-menu-horizontal pure-menu-active-hover">
				<li class="pure-menu-item">
					<a class="pure-menu-link" @click="popupNewPod">New Pod</a>
				</li>
			</ul>
		</span>
		<div v-for="plugin of podPlugins" :key="plugin.plugin.name">
			<template v-if="plugin.pods.length > 0">
				<h2>{{ plugin.pods[0].handler }}</h2>
				<ul v-for="pod in plugin.pods" :key="pod.uuid" class="pod-list">
					<li>
						<RouterLink :to="'/pod/' + pod.uuid">{{ pod.name }}</RouterLink>
					</li>
				</ul>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { RouterLink } from 'vue-router'

import type * as schema from '../../../../schemaV2'
import * as api from '@/util/apiv2'
import PopupPodCreate from '@/components/popups/PopupPodCreate.vue'
import { popupEmitter } from '@/util/popupSimple'

export default defineComponent({
	setup() {
		const podPlugins = ref<
			{
				plugin: schema.podListPlugins_resT['plugins'][0]
				pods: schema.podList_resT['pods']
			}[]
		>([])

		async function gen() {
			const result = await api.podListPlugins({})
			podPlugins.value = []
			for (const plugin of result.plugins) {
				const { pods } = await api.podList({
					handler: plugin.name,
				})
				podPlugins.value.push({ plugin, pods })
			}
		}
		;(async () => {
			await gen()
		})()

		popupEmitter.on('new-pod::close', async ({ name, type }) => {
			if (!name || !type) return

			await api.podAdd({ name, handler: type })
			await gen()
		})

		function popupNewPod() {
			popupEmitter.emit('new-pod::open', { component: PopupPodCreate })
		}

		return {
			podPlugins,
			popupNewPod,
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
