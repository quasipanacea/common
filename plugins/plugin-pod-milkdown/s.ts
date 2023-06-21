import { utilPlugin } from '@quasipanacea/common/server/index.js'

import { trpcRouter } from './podMilkdown.js'

const pluginAppRouter = utilPlugin.yieldPluginAppRouter('milkdown', trpcRouter)
export type PluginAppRouter = typeof pluginAppRouter
