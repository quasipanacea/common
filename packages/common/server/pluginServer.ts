import { default as _ } from 'lodash'

import * as t from '../types.ts'
const plugins: t.ServerPluginModule_t[] = []

export function getFamilies() {
	return t.resourceNamesSingular
}

export function register(plugin: t.ServerPluginModule_t): void {
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

export function get(family: string, id: string): t.ServerPluginModule_t {
	const plugin = plugins.find(
		(item) => item.metadata.family === family && item.metadata.id === id,
	)
	if (!plugin) {
		throw new Error(
			`Failed to find client plugin with family '${family} and id '${id}'`,
		)
	}

	return plugin
}

export function list(family?: string): t.ServerPluginModule_t[] {
	const values = plugins.filter((item) => item.metadata.family === family)

	return values
}
