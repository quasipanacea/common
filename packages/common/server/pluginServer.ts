import { z, _ } from '../mod.ts'

import * as t from '../types.ts'
const plugins: t.AnyServerPlugin_t[] = []

export function getFamilies() {
	return t.familyPlugins
}

export function register<T extends keyof t.ServerPluginMap_t>(
	plugin: t.ServerPluginMap_t[T],
): void {
	if (!plugins.some((item) => _.isEqual(item.metadata, plugin.metadata))) {
		plugins.push(plugin)
	}
}

export function get<T extends keyof t.ServerPluginMap_t>(
	family: T,
	id: string,
): t.ServerPluginMap_t[T] {
	let plugin = plugins.find((item) => _.isEqual(item.metadata, { family, id }))
	if (!plugin) {
		throw new Error(`Failed to find server plugin with id: ${id}`)
	}

	return plugin
}

export function list<T extends keyof t.ServerPluginMap_t>(
	family?: T,
): t.ServerPluginMap_t[T][] {
	let values = plugins.filter((item) => item.metadata.family === family)

	return values
}
