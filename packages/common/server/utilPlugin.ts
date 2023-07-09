import { path } from 'std/path/mod.ts'
import {
	type AnyProcedure,
	type AnyRouter,
	type ProcedureRouterRecord,
} from '@trpc/server'

import { coreRouter } from '../routes.ts'
import * as utilResource from './utilResource.ts'
import * as plugin from './pluginServer.ts'
import * as t from '../types.ts'
import { instance } from './trpcServer.ts'

// TODO
// This was meant to simplify instantiating tRPC routers for the sole purpose
// of intellisense. However, dynamic property keys kills intellisense (until
// the pluginFamily and pluginId are already explicit properties). So,
// this is unused
type Map = {
	model: ''
	pod:
		| 'chemical'
		| 'flashcard'
		| 'latex'
		| 'markdown'
		| 'plaintext'
		| 'excalidraw'
}
export function yieldPluginAppRouter<
	T extends Extract<'model' | 'pod', string>,
	U extends Map[T],
	V extends AnyRouter,
>(pluginFamily: T, pluginId: U, router: V) {
	return instance.router({
		core: coreRouter,
		plugins: instance.router({
			[pluginFamily]: instance.router({
				[pluginId]: router,
			}),
		}),
	})
}

// TODO: internal
export async function getResource(
	pluginFamily: t.PluginFamilyPlural_t,
	uuid: string,
) {
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
