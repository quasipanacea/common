<template>
	<div id="map" style="width: 100%; height: calc(100% - 50px)"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import MindElixir, { E } from 'mind-elixir'

onMounted(() => {
	let options = {
		el: '#map', // or HTMLDivElement
		direction: MindElixir.LEFT,
		draggable: true, // default true
		contextMenu: true, // default true
		toolBar: true, // default true
		nodeMenu: true, // default true
		keypress: true, // default true
		locale: 'en', // [zh_CN,zh_TW,en,ja,pt,ru] waiting for PRs
		overflowHidden: false, // default false
		primaryLinkStyle: 2, // [1,2] default 1
		primaryNodeVerticalGap: 15, // default 25
		primaryNodeHorizontalGap: 15, // default 65
		contextMenuOption: {
			focus: true,
			link: true,
			extend: [
				{
					name: 'Node edit',
					onclick: () => {
						alert('extend menu')
					},
				},
			],
		},
		allowUndo: false,
		before: {
			insertSibling(el, obj) {
				return true
			},
			async addChild(el, obj) {
				return true
			},
		},
	}

	let mind = new MindElixir(options)
	// mind.install(plugin) // install your plugin

	// create new map data
	const data = MindElixir.new('new topic')
	// or `example`
	// or the data return from `.getAllData()`
	mind.init(data)

	// get a node
	E('node-id')
})
</script>
