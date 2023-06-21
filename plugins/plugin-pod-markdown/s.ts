import { utilPlugin } from '@quasipanacea/common/server/index.js'

import { trpcRouter } from './podMarkdown.js'

const pluginAppRouter = utilPlugin.yieldPluginAppRouter('markdown', trpcRouter)
export type PluginAppRouter = typeof pluginAppRouter
