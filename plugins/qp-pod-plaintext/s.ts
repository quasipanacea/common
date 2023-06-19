import { trpc } from '@common/server/index.ts'
import { coreRouter } from '@common/index.ts'

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
