import * as t from '../types.ts'

type ServerPluginTypeMap = {
	pod: t.PodServerPlugin_t
}

const podPlugins = new Map<string, t.PodServerPlugin_t>()

export async function register(plugin: t.AnyServerPlugin_t) {
	switch (plugin.metadata.kind) {
		case 'pod':
			podPlugins.set(plugin.metadata.id, plugin as t.PodServerPlugin_t)
			break
		default:
			throw new Error(
				`Failed to recognize plugin kind: ${plugin.metadata.kind} (id: ${plugin.metadata.id})`,
			)
	}
}

export function get<T extends keyof ServerPluginTypeMap>(
	pluginType: T,
	pluginId: string,
): ServerPluginTypeMap[T] {
	const pluginsMap = list(pluginType)

	const plugin = pluginsMap.get(pluginId)
	if (!plugin) {
		throw new Error(`Failed to find server plugin with id: ${pluginId}`)
	}
	return plugin
}

export function list<T extends keyof ServerPluginTypeMap>(
	pluginType: T,
): Map<string, ServerPluginTypeMap[T]> {
	let pluginsMap = null
	if (pluginType === 'pod') {
		pluginsMap = podPlugins
	} else {
		throw new Error(`Failed to recognize pluginType: ${pluginType}`)
	}

	return pluginsMap as any
}
