import * as t from '../types.ts'

type ServerPluginsMap = {
	overview: t.OverviewServerPlugin_t
	pod: t.PodServerPlugin_t
	model: t.ModelServerPlugin_t
	view: t.ViewServerPlugin_t
}

const plugins = new Map<
	keyof ServerPluginsMap,
	Map<string, ServerPluginsMap[keyof ServerPluginsMap]>
>()
const pluginFamilies = Object.keys(
	t.AnyIsomorphicPlugin.shape.kind.Enum,
) as unknown as t.AnyIsomorphicPlugin_t['kind']

export function getFamilies() {
	return pluginFamilies
}

export function register(pluginModule: t.AnyServerPlugin_t) {
	const familyMap = plugins.get(pluginModule.metadata.kind)
	if (familyMap) {
		familyMap.set(
			pluginModule.metadata.id,
			pluginModule as t.OverviewServerPlugin_t,
		)
	} else {
		plugins.set(
			pluginModule.metadata.kind,
			new Map([
				[pluginModule.metadata.id, pluginModule as t.OverviewServerPlugin_t],
			]),
		)
	}
}

export function get<T extends keyof ServerPluginsMap>(
	pluginFamily: T,
	pluginId: string,
): ServerPluginsMap[T] {
	const familyMap = list(pluginFamily)

	const pluginModule = familyMap.get(pluginId)
	if (!pluginModule) {
		throw new Error(`Failed to find server plugin with id: ${pluginId}`)
	}

	return pluginModule
}

export function list<T extends keyof ServerPluginsMap>(
	pluginFamily: T,
): Map<string, ServerPluginsMap[T]> {
	const familyMap = plugins.get(pluginFamily)

	if (familyMap) {
		return familyMap as any
	} else {
		return new Map()
	}
}
