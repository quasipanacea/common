import { path } from './mod.ts'

import * as util from './util.ts'
import type * as t from './types.ts'

export async function getHooks(
	pluginId: string,
): Promise<t.Hooks<Record<string, unknown>>> {
	const pluginList = await getPluginList()

	const plugin = pluginList.find((item) => {
		return item.kind === 'pod' && item.id === pluginId
	})

	if (!plugin) {
		throw new Error(`Failed to find plugin: ${plugin}`)
	}

	const tsFile = path.join(
		plugin.dir,
		'pod' + pluginId[0].toUpperCase() + pluginId.slice(1) + '.ts',
	)
	const module = (await import(tsFile)) as t.PluginModule

	return module.hooks
}

export async function getPluginList(): Promise<t.Plugin_t[]> {
	const plugins: t.Plugin_t[] = []

	const pluginsDir = path.join(util.getPluginsDir())
	for await (const pluginEntry of await Deno.readDir(pluginsDir)) {
		const pluginDir = path.join(pluginsDir, pluginEntry.name)
		if (!pluginEntry.isDirectory) {
			continue
		}

		const kind = pluginEntry.name.split('-')[1]
		if (kind === 'pack') {
			continue
		}

		plugins.push({
			id: pluginEntry.name.split('-')[2],
			kind,
			dir: pluginDir,
		})
	}

	return plugins
}
