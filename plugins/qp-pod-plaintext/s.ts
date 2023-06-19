import { trpc } from '@common/server/trpc.ts'
import { coreRouter } from '@common/routes.ts'

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
