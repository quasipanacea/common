<template>
	<div class="content">
		<h2>Guide</h2>
		<ul>
			<li>Left-click to pan</li>
			<li>Left-click (hold) to connect nodes</li>
			<li>Right-click for context menu</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { t } from '@quasipanacea/common/index.ts'
import {
	pluginClient,
	popup,
	trpcClient,
	utilClient,
	type BareAppRouter,
} from '@quasipanacea/common/client/index.js'

const props = defineProps<{
	pluginId: string
}>()

const plugin = pluginClient.get(props.pluginId)
console.log(plugin)
</script>
