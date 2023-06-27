import * as plugin from './plugin.ts'
import type { ClientPluginsMap } from './plugin.ts'
import { yieldClient } from './trpcClient.ts'
import { type BareAppRouter } from '../routes.ts'

export async function getPluginByFormat<T extends keyof ClientPluginsMap>(
	pluginFamily: T,
	format: string,
): Promise<plugin.ClientPluginsMap[T]> {
	const api = yieldClient<BareAppRouter>()

	if (pluginFamily === 'pod') {
		const storedValueObj =
			(await api.core.settingsGet.query()).mimesToPlugin || {}

		let pluginId = storedValueObj[format]
		if (!pluginId) {
			const indexJson = await api.core.indexGet.query()
			if (indexJson.formats[format]) {
				pluginId = indexJson.formats[format][0]
			} else {
				throw new Error(`Failed to find plugin to use for format ${format}`)
			}
		}

		const pluginModule = plugin.get(pluginFamily, pluginId)
		return pluginModule
	} else {
		throw new Error(`Not implemented for pluginType: ${pluginFamily}`)
	}
}
