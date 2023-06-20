import { trpcServer } from '@quasipanacea/common/server/index.js'
import { coreRouter } from '@quasipanacea/common/index.js'

import { trpcRouter } from './podChemical.js'

const inferenceOnlyAppRouter = trpcServer.instance.router({
	core: coreRouter,
	plugins: trpcServer.instance.router({
		pods: trpcServer.instance.router({
			chemical: trpcRouter,
		}),
	}),
})
export type InferenceOnlyAppRouter = typeof inferenceOnlyAppRouter
