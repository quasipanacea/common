import * as path from 'node:path'
import { z } from 'zod'

import { t } from '@quasipanacea/common/index.ts'
import { serverUtil } from '@quasipanacea/plugin-utility/server/index.ts'

export type State = {
	someFile: string
}

export const hooks: t.Hooks<'model', State> = {
	makeState({ dir }) {},
	async onAdd({ state }) {
		await serverUtil.assertFileExists(state)
	},
}

export function getRequests() {
	const value = Deno.env.get('GOOGLE_API_KEY')
	console.log('api key', value)
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
