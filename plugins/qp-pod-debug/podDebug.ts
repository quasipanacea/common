import { z, path, Router, send } from '@server/mod.ts'

import * as t from '@quasipanacea/common/types.ts'
import { pluginUtil } from '@quasipanacea/plugin-utility/server/index.ts'

export type State = {}

export const hooks: t.Hooks<State> = {
	makeState(pod) {
		return {}
	},
	async onPodAdd(pod, state) {},
}

const trpc = pluginUtil.useTrpc<State>()

export const trpcRouter = trpc.router({})
