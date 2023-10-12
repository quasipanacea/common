import * as path from 'node:path'
import { z } from 'zod'

import { t } from '@quasipanacea/common/index.ts'
import { serverUtil } from '@quasipanacea/plugin-utility/server/index.ts'
import { util } from '@quasipanacea/common/server/index.ts'

type StateJson_t = {
	state: unknown
}

export type State = {
	stateJsonFile: string
}

export const hooks: t.Hooks<'pod', State> = {
	makeState({ dir }) {
		const stateJsonFile = path.join(dir, 'state.json')

		return {
			stateJsonFile,
		}
	},
	async onAdd({ state }) {
		await serverUtil.assertFileExists(state.stateJsonFile, '{}\n')
	},
}

const trpc = serverUtil.useTrpc<State>()
const pprocedure = serverUtil.yieldPluginProcedure(trpc, hooks)

export const pluginProcedure = trpc.procedure
	.input(
		z.object({
			uuid: t.Uuid,
		}),
	)
	.use(serverUtil.executeAllMiddleware(trpc, hooks))

export const trpcRouter = trpc.router({
	saveDrawing: pluginProcedure
		.input(
			z.object({
				state: z.any(),
			}),
		)
		.output(z.void())
		.mutation(async ({ ctx, input }) => {
			await Deno.writeTextFile(
				ctx.state.stateJsonFile,
				util.jsonStringify({ state: input.state }),
			)
		}),
	restoreDrawing: pluginProcedure
		.output(
			z.object({
				state: z.any(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const stateJson: StateJson_t = JSON.parse(
				await Deno.readTextFile(ctx.state.stateJsonFile),
			)

			return { state: stateJson.state }
		}),
})
