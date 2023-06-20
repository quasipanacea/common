import { trpc } from '@quasipanacea/common/server/index.js'
import { coreRouter } from '@quasipanacea/common/index.js'

import { trpcRouter } from './podLatex.js'

const inferenceOnlyAppRouter = trpc.router({
	core: coreRouter,
	plugins: trpc.router({
		pods: trpc.router({
			latex: trpcRouter,
		}),
	}),
})
export type InferenceOnlyAppRouter = typeof inferenceOnlyAppRouter
