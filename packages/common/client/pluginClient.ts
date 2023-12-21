import { default as _ } from 'lodash'
import * as t from '../types.ts'
import type { BareAppRouter } from '../routes.ts'
import { yieldClient } from './trpcClient.ts'

const plugins: t.ClientPluginModule_t[] = []

export function getFamilies() {
	return t.resourceNamesSingular
}

export function register(plugin: t.ClientPluginModule_t): void {
	if (
		!plugins.some((item) => {
			return plugin.metadata.id === item.metadata.id
		})
	) {
		plugins.push(plugin)
	}
}

export function get(id: string): t.ClientPluginModule_t {
	const plugin = plugins.find((item) => {
		return item.metadata.id === id
	})

	if (!plugin) {
		throw new Error(`Failed to find client plugin with id of '${id}'`)
	}

	return plugin
}

export function list(family?: string): t.ServerPluginModule_t[] {
	const values = plugins.filter((item) => item.metadata.id.startsWith(family === void 0 ? '' : family + '.'))

	return values
}
