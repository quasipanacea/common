import * as t from '../types.ts'

const podPlugins = new Map<string, t.PodServerPlugin_t>()

export async function registerPlugin(plugin: t.AnyServerPlugin_t) {
	switch (plugin.metadata.kind) {
		case 'pod':
			podPlugins.set(plugin.metadata.id, plugin as t.PodServerPlugin_t)
			break
		default:
			throw new Error(`Failed to recognize plugin kind: ${plugin.metadata.kind} (id: ${plugin.metadata.id})`)
	}
}

type ServerPluginTypeMap = {
	'pod': t.PodServerPlugin_t
}
export function getPlugin<T extends keyof ServerPluginTypeMap>(pluginType: T, pluginId: string): ServerPluginTypeMap[T] {
	let pluginsMap = null
	if (pluginType === 'pod') {
		pluginsMap = podPlugins
	} else {
		throw new Error(`Failed to recognize pluginType: ${pluginType}`)
	}

	const plugin = pluginsMap.get(pluginId)
	if (!plugin) {
		throw new Error(`Failed to find server plugin with id: ${pluginId}`)
	}
	return plugin
}
