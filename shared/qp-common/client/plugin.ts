import * as t from '../types.js'

const overviewPlugins = new Map<string, t.OverviewClientPlugin_t>()
const podPlugins = new Map<string, t.PodClientPlugin_t>()
const modelPlugins = new Map<string, t.ModelClientPlugin_t>()
const viewPlugins = new Map<string, t.ViewClientPlugin_t>()

export async function registerPlugin(plugin: t.AnyClientPlugin_t) {
	switch (plugin.metadata.kind) {
		case 'overview':
			overviewPlugins.set(plugin.metadata.id, plugin as t.OverviewClientPlugin_t)
			break
		case 'pod':
			podPlugins.set(plugin.metadata.id, plugin as t.PodClientPlugin_t)
			break
		case 'model':
			modelPlugins.set(plugin.metadata.id, plugin as t.ModelClientPlugin_t)
			break
		case 'view':
			viewPlugins.set(plugin.metadata.id, plugin as t.ViewClientPlugin_t)
			break
		default:
			throw new Error(`Failed to recognize plugin kind: ${plugin.metadata.kind} (id: ${plugin.metadata.id})`)
	}
}

type ClientPluginTypeMap = {
	'overview': t.OverviewClientPlugin_t
	'pod': t.PodClientPlugin_t
	'model': t.ModelClientPlugin_t,
	'view': t.ViewClientPlugin_t
}
export function getPlugin<T extends keyof ClientPluginTypeMap>(pluginType: T, pluginId: string): ClientPluginTypeMap[T] {
	const pluginsMap = getPlugins(pluginType)

	const plugin = pluginsMap.get(pluginId)
	if (!plugin) {
		throw new Error(`Failed to find client plugin with id: ${pluginId}`)
	}
	return plugin as any
}

export function getPlugins<T extends keyof ClientPluginTypeMap>(pluginType: T): Map<string, ClientPluginTypeMap[T]> {
	let pluginsMap = null
	if (pluginType === 'overview') {
		pluginsMap = overviewPlugins
	} else if (pluginType === 'pod') {
		pluginsMap = podPlugins
	} else if (pluginType === 'model') {
		pluginsMap = modelPlugins
	} else if (pluginType === 'view') {
		pluginsMap = viewPlugins
	} else {
		throw new Error(`Failed to recognize pluginType: ${pluginType}`)
	}

	return pluginsMap as any
}
