import { utilPlugin } from '@quasipanacea/common/server/index.js'

import { trpcRouter } from './podFlashcard.js'

const pluginAppRouter = utilPlugin.yieldPluginAppRouter('flashcard', trpcRouter)
export type PluginAppRouter = typeof pluginAppRouter
