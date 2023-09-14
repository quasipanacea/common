<template>
	<Milkdown />
</template>

<script setup lang="ts">
import { debounce } from 'lodash'

import { Milkdown, useEditor } from '@milkdown/vue'
import { usePluginViewFactory } from '@prosemirror-adapter/vue'
import {
	defaultValueCtx,
	editorViewCtx,
	serializerCtx,
	Editor,
	rootCtx,
} from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { clipboard } from '@milkdown/plugin-clipboard'
import { cursor } from '@milkdown/plugin-cursor'
import { listener } from '@milkdown/plugin-listener'
import { prism } from '@milkdown/plugin-prism'
import { math } from '@milkdown/plugin-math'
import { tooltipFactory } from '@milkdown/plugin-tooltip'
import { slashFactory } from '@milkdown/plugin-slash'
import { emoji } from '@milkdown/plugin-emoji'
import { diagram } from '@milkdown/plugin-diagram'
import { indent } from '@milkdown/plugin-indent'
import { upload } from '@milkdown/plugin-upload'
import { block } from '@milkdown/plugin-block'
import { nord } from '@milkdown/theme-nord'
import { Plugin, PluginKey } from '@milkdown/prose/state'
import { $prose } from '@milkdown/utils'

import Slash from './Slash.vue'
import Tooltip from './Tooltip.vue'
import '@milkdown/theme-nord/style.css'

const props = defineProps<{
	text: string
	saveFn: (text: string) => Promise<void>
}>()

const myPluginKey = new PluginKey('milkdown-keytest')
const myPlugin = $prose(
	(ctx) =>
		new Plugin({
			key: myPluginKey,
			props: {
				handleKeyDown(view, event) {
					debounce(async () => {
						const view = ctx.get(editorViewCtx)
						const serializer = ctx.get(serializerCtx)

						const text = serializer(view.state.doc)
						await props.saveFn(text)
					}, 500)()
				},
			},
		}),
)

const slash = slashFactory('Commands')
const tooltip = tooltipFactory('my-tooltip')

const pluginViewFactory = usePluginViewFactory()

useEditor((root) => {
	return Editor.make()
		.config((ctx) => {
			ctx.set(rootCtx, root)
			ctx.set(defaultValueCtx, props.text)
		})
		.config(nord)
		.use(commonmark)
		.use(gfm)
		.use(history)
		.use(clipboard)
		.use(cursor)
		.use(listener)
		.use(prism)
		.use(math)
		.config((ctx) => {
			ctx.set(tooltip.key, {
				view: pluginViewFactory({
					component: Tooltip,
				}),
			})
		})
		.use(tooltip)
		.config((ctx) => {
			ctx.set(slash.key, {
				view: pluginViewFactory({
					component: Slash,
				}),
			})
		})
		.use(slash)
		.use(emoji)
		.use(diagram)
		.use(indent)
		.use(upload)
		.use(block)
		.use(myPlugin)
})
</script>
