import { z } from '../mod.ts'

import * as t from '../types.ts'

type ServerPluginsMap = {
	overview: t.OverviewServerPlugin_t
	model: t.ModelServerPlugin_t
	view: t.ViewServerPlugin_t
	pod: t.PodServerPlugin_t
	theme: t.ThemeServerPlugin_t
	pack: t.PackServerPlugin_t
	[key: string]: t.AnyServerPlugin_t
}

const plugins = new Map<
	keyof ServerPluginsMap,
	Map<string, ServerPluginsMap[keyof ServerPluginsMap]>
>()
const pluginFamilies = Object.keys(
	t.FamilyPlugins.Enum, // TODO
) as unknown as t.FamilyPlugins_t

export function getFamilies() {
	return pluginFamilies
}

export function register(pluginModule: t.AnyServerPlugin_t) {
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

export function get<T extends keyof ServerPluginsMap>(
	pluginFamily: T,
	pluginId: string,
): ServerPluginsMap[T] {
	const familyMap = list(pluginFamily)

	const pluginModule = familyMap.get(pluginId)
	if (!pluginModule) {
		throw new Error(
			`Failed to find server plugin with family '${pluginFamily}', id '${pluginId}'`,
		)
	}

	return pluginModule
}

export function list<T extends keyof ServerPluginsMap>(
	pluginFamily: T,
): Map<string, ServerPluginsMap[T]> {
	const familyMap = plugins.get(pluginFamily)

	if (familyMap) {
		return familyMap
	} else {
		return new Map()
	}
}
