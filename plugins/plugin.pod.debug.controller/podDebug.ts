import * as path from 'node:path'
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
