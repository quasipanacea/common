<template>
	<div ref="goldenLayoutEl" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useSlots } from 'vue'
import { createVNode, render } from 'vue'
import { GoldenLayout, LayoutConfig } from 'golden-layout'
import 'golden-layout/dist/css/goldenlayout-base.css'
import 'golden-layout/dist/css/themes/goldenlayout-light-theme.css'

export type CustomLayoutConfig = LayoutConfig & {
	root: {
		content: {
			factoryFn?: GoldenLayout.ComponentFactoryFunction
		}[]
	}
}

const { layoutConfig } = defineProps<{
	layoutConfig: CustomLayoutConfig
}>()
const slots = useSlots()

let goldenLayoutEl = ref<null>(null)
let goldenLayout: GoldenLayout | null = null
let destroyArr: (() => void)[] = []

function vueMount(
	component: Parameters<typeof createVNode>[0],
	{
		props,
		children,
		element,
		app,
	}: {
		props?: Parameters<typeof createVNode>[1]
		children?: Parameters<typeof createVNode>[2]
		element?: unknown
		app?: Element | HTMLElement
	} = {},
) {
	let el = element

	let vNode = createVNode(component, props, children)
	if (app && app._context) vNode.appContext = app._context
	if (el) render(vNode, el)
	else if (typeof document !== 'undefined')
		render(vNode, (el = document.createElement('div')))

	const destroy = () => {
		if (el) render(null, el)
		el = null
		vNode = null
	}

	return { vNode, destroy, el }
}

onMounted(async () => {
	goldenLayout = new GoldenLayout(goldenLayoutEl.value!)
	for (const [name, component] of Object.entries(slots)) {
		goldenLayout.registerComponentFactoryFunction(name, (container, state) => {
			const item = layoutConfig.root?.content?.find(
				(item) => item.componentType === name,
			)
			if (item?.factoryFn) {
				item.factoryFn(container, state)
			}
			const { vNode, destroy, el } = vueMount(component, {
				element: container.element,
			})
			destroyArr.push(destroy)
		})
	}

	goldenLayout.loadLayout(layoutConfig)
})
onUnmounted(() => {
	for (const fn of destroyArr) {
		fn()
	}
})

// Resize
const _onResize = () => {
	if (goldenLayoutEl) {
		const rect = goldenLayoutEl.value.getBoundingClientRect()
		goldenLayout?.setSize(rect.width, rect.height)
	}
}
onMounted(() => {
	_onResize()
	window.addEventListener('resize', _onResize)
})
onUnmounted(() => {
	window.removeEventListener('resize', _onResize)
})
</script>
