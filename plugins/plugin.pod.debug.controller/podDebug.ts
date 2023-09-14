import * as path from 'std/path/mod.ts'
import { Router, send } from 'oak/mod.ts'
import { z } from 'zod'

import { t } from '@quasipanacea/common/index.ts'
import { serverUtil } from '@quasipanacea/plugin-utility/server/index.ts'

export type State = {}

export const hooks: t.Hooks<'pod', State> = {
	makeState({ pod }) {
		return {}
	},
	async onAdd() {},
}

const trpc = serverUtil.useTrpc<State>()

export const trpcRouter = trpc.router({})