import { path } from '../mod.ts'

import { type AnyRouter } from '@trpc/server'

import { coreRouter } from '../routes.ts'
import * as t from '../types.ts'
import * as util from './util.ts'
import { instance } from './trpcServer.ts'

export function yieldPluginAppRouter<T extends string, U extends AnyRouter>(
	slug: T,
	router: U,
) {
	return instance.router({
		core: coreRouter,
		plugins: instance.router({
			pods: instance.router({
				[slug]: router,
			}),
		}),
	})
}

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
		'pod' + plugin.id[0].toUpperCase() + plugin.id.slice(1) + '.ts',
	)
	const module = (await import(tsFile)) as t.PluginModule

	return module.hooks
}

export async function getPluginList(): Promise<t.Plugin_t[]> {
	const plugins: t.Plugin_t[] = []

	const pluginsDir = path.join(util.getPluginsDir())
	for await (const entry of Deno.readDir(pluginsDir)) {
		const pluginDir = path.join(pluginsDir, entry.name)
		if (!entry.isDirectory) {
			continue
		}
		const isomorphicFile = path.join(pluginDir, '_isomorphic.ts')

		let pModule: t.PluginExportIsomorphic_t
		try {
			pModule = await import(isomorphicFile)

			util.validateSchema<typeof t.PluginExportIsomorphic>(
				pModule,
				t.PluginExportIsomorphic,
			)
		} catch (err) {
			if (err instanceof Deno.errors.NotFound) {
				throw new Error(`Expected file: ${isomorphicFile}`)
			} else {
				throw err
			}
		}

		if (pModule.metadata.id === 'pack') {
			continue
		}

		plugins.push({
			id: pModule.metadata.id,
			kind: pModule.metadata.kind,
			dir: pluginDir,
		})
	}

	return plugins
}
