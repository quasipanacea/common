import { utilPlugin } from '@quasipanacea/common/server/index.js'

import { trpcRouter } from './podChemical.js'

const pluginAppRouter = utilPlugin.yieldPluginAppRouter('chemical', trpcRouter)
export type PluginAppRouter = typeof pluginAppRouter
