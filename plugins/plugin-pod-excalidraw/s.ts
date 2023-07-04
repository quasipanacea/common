import { utilPlugin } from '@quasipanacea/common/server/index.js'

import { trpcRouter } from './podExcalidraw.js'

const pluginAppRouter = utilPlugin.yieldPluginAppRouter(
	'excalidraw',
	trpcRouter,
)
export type PluginAppRouter = typeof pluginAppRouter
