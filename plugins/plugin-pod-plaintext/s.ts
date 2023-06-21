import { utilPlugin } from '@quasipanacea/common/server/index.js'

import { trpcRouter } from './podPlaintext.js'

const pluginAppRouter = utilPlugin.yieldPluginAppRouter('plaintext', trpcRouter)
export type PluginAppRouter = typeof pluginAppRouter
