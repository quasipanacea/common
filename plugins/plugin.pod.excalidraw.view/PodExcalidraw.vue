<template>
	<ExcalidrawWrapper
		:uuid="uuid"
		:initialData="initialData"
	></ExcalidrawWrapper>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { applyReactInVue } from 'veaury'

import { trpcClient } from '@quasipanacea/common/client/index.js'
import type { PluginAppRouter } from '@quasipanacea/plugin.pod.excalidraw.controller/shared/s.ts'

import _ExcalidrawWrapper from './util/react_app/ExcalidrawWrapper.jsx'
import { onMounted, ref } from 'vue'

const api = trpcClient.yieldClient<PluginAppRouter>()

const route = useRoute()
function getUuid(): string {
	const uuid = route.params.podUuid
	if (!uuid) throw new Error('uuid must be defined')
	if (Array.isArray(uuid)) throw new Error('uuid must not be an array')
	return uuid
}
const uuid = getUuid()

const initialData = new Promise(async (resolve, reject) => {
	try {
		const state = await api.plugins.pod.excalidraw.restoreDrawing.query({
			uuid,
		})
		resolve({
			elements: state.state,
		})
	} catch (err) {
		reject(err)
	}
})

const ExcalidrawWrapper = applyReactInVue(_ExcalidrawWrapper)
</script>
