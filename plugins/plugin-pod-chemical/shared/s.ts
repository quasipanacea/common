import { utilPlugin } from '@quasipanacea/common/server/index.ts'
import { coreRouter } from '@quasipanacea/common/routes.ts'
import { trpcServer } from '@quasipanacea/common/server/index.ts'

import { trpcRouter as chemicalRouter } from '../podChemical.ts'

const pluginAppRouter = trpcServer.instance.router({
	core: coreRouter,
	plugins: trpcServer.instance.router({
		pod: trpcServer.instance.router({
			chemical: chemicalRouter,
		}),
	}),
})
export type PluginAppRouter = typeof pluginAppRouter
