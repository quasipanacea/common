import { z, path, Router, send } from '@server/mod.ts'

import * as t from '@quasipanacea/common/types.ts'
import * as pluginUtility from '@quasipanacea/plugin-utility/util.ts'

export type State = {}

export const hooks: t.Hooks<State> = {
	makeState(pod) {
		return {}
	},
	async onPodAdd(pod, state) {},
}

const trpc = pluginUtility.useTrpc<State>()

export const trpcRouter = trpc.router({})
