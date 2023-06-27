import { trpcServer, utilPlugin } from '@quasipanacea/common/server/index.js'

import { trpcRouter } from './podLatex.js'

const pluginAppRouter = utilPlugin.yieldPluginAppRouter('latex', trpcRouter)
export type PluginAppRouter = typeof pluginAppRouter
