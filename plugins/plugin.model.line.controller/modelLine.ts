import * as path from 'node:path'
import { z } from 'zod'

import { t } from '@quasipanacea/common/index.ts'
import { serverUtil } from '@quasipanacea/plugin-utility/server/index.ts'

export type State = {
	stateJsonFile: string
}

export const hooks: t.Hooks<'model', State> = {
	makeState({ dir }) {
		return {
			stateJsonFile: path.join(dir, 'state.json'),
		}
	},
	async onAdd({ state }) {
		await serverUtil.assertFileExists(state.stateJsonFile)
	},
}

const trpc = serverUtil.useTrpc<State>()

export const trpcRouter = trpc.router({
	read: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
			}),
		)
		.output(
			z.object({
				content: z.string(),
			}),
		)
		.use(serverUtil.executeAllMiddleware(trpc, hooks))
		.query(async ({ ctx, input }) => {
			const content = await Deno.readTextFile(ctx.state.latexFile)

			return {
				content,
			}
		}),
})
