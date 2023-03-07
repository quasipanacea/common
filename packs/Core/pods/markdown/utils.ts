import {
	createVNode,
	render,
} from 'vue'

export function vueMount(
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
