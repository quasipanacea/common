<template>
	<div
		class="hack-unique-graph-wrapper"
		style="display: grid; grid-template-rows: 43px 1fr; height: 100%"
	>
		<div class="tabs is-left mb-0">
			<ul>
				<li
					v-for="tab in tabs"
					:key="tab"
					:class="{ 'is-active': activeTab === tab }"
				>
					<a @click="setActiveTab(tab)">{{ tab }}</a>
				</li>
			</ul>
		</div>
		<div class="is-relative">
			<GraphCytoscape v-if="activeTab === 'Cytoscape'" />
			<GraphVis v-if="activeTab === 'Vis'" />
			<GraphG6 v-if="activeTab === 'G6'" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import GraphCytoscape from './util/GraphCytoscape.vue'
import GraphVis from './util/GraphVis.vue'
import GraphG6 from './util/GraphG6.vue'

const activeTab = ref('Cytoscape')
const tabs = ref(['Cytoscape', 'Vis', 'G6'])
function setActiveTab(name: string) {
	activeTab.value = name
}
</script>
