import { trpcServer } from '@quasipanacea/common/server/index.js'
import { coreRouter } from '@quasipanacea/common/index.js'

import { trpcRouter } from './podLatex.js'

const inferenceOnlyAppRouter = trpcServer.instance.router({
	core: coreRouter,
	plugins: trpcServer.instance.router({
		pods: trpcServer.instance.router({
			latex: trpcRouter,
		}),
	}),
})
export type InferenceOnlyAppRouter = typeof inferenceOnlyAppRouter
