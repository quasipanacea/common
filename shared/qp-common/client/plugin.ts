import * as t from '../types.js'

const overviewPlugins = new Map<string, ClientPlugin>()
const podPlugins = new Map<string, ClientPlugin>()
const modelPlugins = new Map<string, ClientPlugin>()
const viewPlugins = new Map<string, ClientPlugin>()

type ClientPlugin = {
	metadata: t.PluginExportIsomorphic_t['metadata'],
	component: unknown
}

export async function registerPlugin(plugin: ClientPlugin) {
	switch (plugin.metadata.kind) {
		case 'overview':
			overviewPlugins.set(plugin.metadata.id, plugin)
			break
		case 'pod':
			podPlugins.set(plugin.metadata.id, plugin)
			break
		case 'model':
			modelPlugins.set(plugin.metadata.id, plugin)
			break
		case 'view':
			viewPlugins.set(plugin.metadata.id, plugin)
			break
		default:
			throw new Error(`Failed to recognize plugin kind: ${plugin.metadata.kind} (id: ${plugin.metadata.id})`)
	}
}

export async function getPlugins() {
	return {
		overviewPlugins,
		podPlugins,
		modelPlugins,
		viewPlugins
	}
}
