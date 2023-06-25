import * as t from '../types.js'

export type ClientPluginsMap = {
	overview: t.OverviewClientPlugin_t
	pod: t.PodClientPlugin_t
	model: t.ModelClientPlugin_t
	view: t.ViewClientPlugin_t
}

const plugins = new Map<
	keyof ClientPluginsMap,
	Map<string, ClientPluginsMap[keyof ClientPluginsMap]>
>()
const pluginFamilies = Object.keys(
	t.AnyIsomorphicPlugin.shape.kind.Enum,
) as unknown as t.AnyIsomorphicPlugin_t['kind']

export function getFamilies() {
	return pluginFamilies
}

export function register(pluginModule: t.AnyClientPlugin_t) {
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

export function get<T extends keyof ClientPluginsMap>(
	pluginFamily: T,
	pluginId: string,
): ClientPluginsMap[T] {
	const familyMap = list(pluginFamily)

	const pluginModule = familyMap.get(pluginId)
	if (!pluginModule) {
		throw new Error(`Failed to find client plugin with id: ${pluginId}`)
	}

	return pluginModule
}

export function list<T extends keyof ClientPluginsMap>(
	pluginFamily: T,
): Map<string, ClientPluginsMap[T]> {
	const familyMap = plugins.get(pluginFamily)

	if (familyMap) {
		return familyMap as any
	} else {
		return new Map()
	}
}
