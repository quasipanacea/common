import * as t from '../types.ts'

export type ClientPluginsMap = {
	overview: t.OverviewClientPlugin_t
	model: t.ModelClientPlugin_t
	view: t.ViewClientPlugin_t
	pod: t.PodClientPlugin_t
	theme: t.ThemeClientPlugin_t
	pack: t.PackClientPlugin_t
	[key: string]: t.AnyClientPlugin_t
}

const plugins = new Map<
	keyof ClientPluginsMap,
	Map<string, ClientPluginsMap[keyof ClientPluginsMap]>
>()
const pluginFamilies = Object.keys(
	t.FamilyPlugins.Enum, // TODO
) as unknown as t.FamilyPlugins_t

export function getFamilies() {
	return pluginFamilies
}

export function register<T extends keyof ClientPluginsMap>(
	pluginModule: ClientPluginsMap[T],
): void {
	const familyMap = plugins.get(pluginModule.metadata.family)
	if (familyMap) {
		familyMap.set(
			pluginModule.metadata.id,
			pluginModule as t.OverviewServerPlugin_t,
		)
	} else {
		plugins.set(
			pluginModule.metadata.family,
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
		return familyMap
	} else {
		return new Map()
	}
}
