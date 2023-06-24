import * as plugin from './plugin.ts'
import type { ClientPluginTypeMap } from './plugin.ts'

export function getPluginByFormat<T extends keyof ClientPluginTypeMap>(
	pluginType: T,
	format: string,
): plugin.ClientPluginTypeMap[T] {
	if (pluginType === 'pod') {
		const storedValue = localStorage.getItem('saved-format-mappings')
		if (!storedValue) {
			throw new Error('Must set format mappings')
		}
		const storedValueObj = JSON.parse(storedValue)

		const pluginId = storedValueObj[format]
		if (!pluginId) {
			throw new Error(`Failed to find plugin to use for format ${format}`)
		}

		const p = plugin.get(pluginType, pluginId)
		return p
	} else {
		throw new Error(`Not implemented for pluginType: ${pluginType}`)
	}
}
