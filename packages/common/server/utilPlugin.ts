import { path } from '../mod.ts'

import { type AnyRouter } from '@trpc/server'

import { coreRouter } from '../routes.ts'
import * as utilResource from './utilResource.ts'
import * as plugin from './pluginServer.ts'
import * as t from '../types.ts'
import { instance } from './trpcServer.ts'

export function yieldPluginAppRouter<T extends string, U extends AnyRouter>(
	slug: T,
	router: U,
) {
	return instance.router({
		core: coreRouter,
		plugins: instance.router({
			// TODO
			pod: instance.router({
				[slug]: router,
			}),
		}),
	})
}

export async function getResource(
	pluginFamily: 'orbs' | 'links' | 'models' | 'pods' | 'views',
	uuid: string,
) {
	const caps = pluginFamily[0].toUpperCase() + pluginFamily.slice(1)

	const dir = utilResource.getResourceDir(pluginFamily, uuid)
	const resourceJson = await utilResource.getResourcesJson(pluginFamily)

	const obj = resourceJson[pluginFamily][uuid]
	if (!obj) {
		throw new Error(
			`Failed to find item of family '${pluginFamily}' with id: ${uuid}`,
		)
	}

	return {
		obj: Object.assign(obj, { uuid }),
		dir,
	}
}

export async function runHook<
	PluginFamily extends 'orbs' | 'links' | 'models' | 'pods' | 'views',
>(
	pluginFamily: PluginFamily,
	singular: string,
	uuid: string,
	hook: 'add' | 'remove',
): Promise<void> {
	let r

	const json = await utilResource.getResourcesJson(pluginFamily)
	for (const [rUuid, resource] of Object.entries(json[pluginFamily])) {
		if (uuid === rUuid) {
			r = resource
			continue
		}
	}

	if (!r) {
		throw new Error(
			`Format for family '${pluginFamily}', uuid '${uuid}' could not be found`,
		)
	}

	const settingsJson = await utilResource.getSettingsJson()
	const pluginId = settingsJson?.mimesToPlugin?.[r.format]
	if (!pluginId) {
		throw new Error(
			`pluginId could not be found for format '${r.format}', uuid '${uuid}'`,
		)
	}

	const pluginModule = plugin.get<PluginFamily>(singular, pluginId)

	console.log('ad', pluginFamily, uuid)
	const dir = utilResource.getResourceDir(pluginFamily, uuid)
	if (!dir) {
		throw new Error(`dir is not defined for family ${pluginFamily}, ${uuid}`)
	}

	if (hook === 'add') {
		if (
			pluginModule.hooks &&
			pluginModule.hooks.makeState &&
			pluginModule.hooks.onAdd
		) {
			const state = await pluginModule.hooks.makeState({
				dir,
				singular: r,
			})
			await pluginModule.hooks.onAdd({ dir, state, singular: r })
		}
	} else {
	}
}
