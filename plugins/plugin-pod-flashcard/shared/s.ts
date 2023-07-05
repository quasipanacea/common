import { utilPlugin } from '@quasipanacea/common/server/index.ts'
import { coreRouter } from '@quasipanacea/common/routes.ts'
import { trpcServer } from '@quasipanacea/common/server/index.ts'

import { trpcRouter as flashcardRouter } from '../podFlashcard.ts'

const pluginAppRouter = trpcServer.instance.router({
	core: coreRouter,
	plugins: trpcServer.instance.router({
		pod: trpcServer.instance.router({
			flashcard: flashcardRouter,
		}),
	}),
})
export type PluginAppRouter = typeof pluginAppRouter
