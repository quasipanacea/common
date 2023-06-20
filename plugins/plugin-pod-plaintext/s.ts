import { trpcServer } from '@quasipanacea/common/server/index.js'
import { coreRouter } from '@quasipanacea/common/index.js'

import { trpcRouter } from './podPlaintext.js'

const inferenceOnlyAppRouter = trpcServer.instance.router({
	core: coreRouter,
	plugins: trpcServer.instance.router({
		pods: trpcServer.instance.router({
			plaintext: trpcRouter,
		}),
	}),
})
export type InferenceOnlyAppRouter = typeof inferenceOnlyAppRouter
