import { trpc } from '@quasipanacea/common/server/index.js'
import { coreRouter } from '@quasipanacea/common/index.js'

import { trpcRouter } from './podPlaintext.js'

const inferenceOnlyAppRouter = trpc.router({
	core: coreRouter,
	plugins: trpc.router({
		pods: trpc.router({
			plaintext: trpcRouter,
		}),
	}),
})
export type InferenceOnlyAppRouter = typeof inferenceOnlyAppRouter
