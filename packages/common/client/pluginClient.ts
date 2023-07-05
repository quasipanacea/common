import { default as _ } from 'lodash'
import * as t from '../types.ts'
import type { BareAppRouter } from '../routes.ts'
import { yieldClient } from './trpcClient.ts'

const plugins: t.AnyClientPlugin_t[] = []

export function getFamilies() {
	return t.pluginFamilySingular
}

export function register<T extends keyof t.ClientPluginMap_t>(
	plugin: t.ClientPluginMap_t[T],
): void {
	if (
		!plugins.some(
			(item) =>
				plugin.metadata.family === item.metadata.family &&
				plugin.metadata.id === item.metadata.id,
		)
	) {
		plugins.push(plugin)
	}
}

export function get<T extends keyof t.ClientPluginMap_t>(
	family: T,
	id: string,
): t.ClientPluginMap_t[T] {
	const plugin = plugins.find(
		(item) => item.metadata.family === family && item.metadata.id === id,
	)
	if (!plugin) {
		throw new Error(
			`Failed to find client plugin with family '${family}' and id '${id}'`,
		)
	}

	return plugin as t.ClientPluginMap_t[T]
}

export function list<T extends keyof t.ClientPluginMap_t>(
	family?: T,
): t.ClientPluginMap_t[T][] {
	const values = plugins.filter((item) => item.metadata.family === family)

	return values as t.ClientPluginMap_t[T][]
}
