<template>
	<Milkdown />
</template>

<script setup lang="ts">
import { debounce } from 'lodash'
// import { slashFactory } from '@milkdown/plugin-slash'
// import { Milkdown, useEditor } from '@milkdown/vue'
// import { usePluginViewFactory } from '@prosemirror-adapter/vue'
// import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
// import { commonmark } from '@milkdown/preset-commonmark'
// import { gfm } from '@milkdown/preset-gfm'
// import { history } from '@milkdown/plugin-history'
// import { clipboard } from '@milkdown/plugin-clipboard'
// import { cursor } from '@milkdown/plugin-cursor'
// import { listener } from '@milkdown/plugin-listener'
// import { prism } from '@milkdown/plugin-prism'
// import { math } from '@milkdown/plugin-math'
// import { TooltipProvider, tooltipFactory } from '@milkdown/plugin-tooltip'
// // import { SlashProvider, slashFactory } from '@milkdown/plugin-slash'
// import { emoji } from '@milkdown/plugin-emoji'
// import { diagram } from '@milkdown/plugin-diagram'
// import { indent } from '@milkdown/plugin-indent'
// import { upload } from '@milkdown/plugin-upload'
// import { block } from '@milkdown/plugin-block'
// import { nord } from '@milkdown/theme-nord'
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
import { slashFactory } from '@milkdown/plugin-slash'
import { commonmark } from '@milkdown/preset-commonmark'
import { nord } from '@milkdown/theme-nord'
import { Milkdown, useEditor } from '@milkdown/vue'
import { usePluginViewFactory } from '@prosemirror-adapter/vue'
import { Plugin, PluginKey } from '@milkdown/prose/state'
import { Decoration, DecorationSet } from '@milkdown/prose/view'
import { $prose } from '@milkdown/utils'

import Slash from './Slash.vue'

const props = defineProps<{
	text: string
	saveFn: (text: string) => Promise<void>
}>()

const copilotPluginKey = new PluginKey('milkdown-keytest')
const copilotPlugin = $prose(
	(ctx) =>
		new Plugin({
			key: copilotPluginKey,
			props: {
				handleKeyDown(view, event) {
					debounce(async () => {
						await props.saveFn(props.text)
					}, 500)()
				},
			},
		}),
)

const tooltip = slashFactory('Commands')

const markdown = props.text

const pluginViewFactory = usePluginViewFactory()

// useEditor((root) => {
// 	return Editor.make()
// 		.config((ctx) => {
// 			ctx.set(rootCtx, '#milkdown')
// 			ctx.set(defaultValueCtx, markdown)
// 		})
// 		.config(nord)
// 		.use(commonmark)
// 		.use(gfm)
// 		.use(history)
// 		.use(clipboard)
// 		.use(cursor)
// 		.use(listener)
// 		.use(prism)
// 		.use(math)
// 		.config((ctx) => {
// 			ctx.set(tooltip.key, {
// 				view: slashPluginView,
// 			})
// 		})
// 		.use(tooltip)
// 		.config((ctx) => {
// 			ctx.set(slash.key, {
// 				view: slashPluginView,
// 			})
// 		})
// 		.use(slash)
// 		.use(emoji)
// 		.use(diagram)
// 		.use(indent)
// 		.use(upload)
// 		.use(block)
// 		.create()
// })

useEditor((root) => {
	return Editor.make()
		.config(nord)
		.config((ctx) => {
			ctx.set(rootCtx, root)
			ctx.set(defaultValueCtx, markdown)
			ctx.set(tooltip.key, {
				view: pluginViewFactory({
					component: Slash,
				}),
			})
		})
		.use(copilotPlugin)
		.use(commonmark)
		.use(tooltip)
})
</script>
