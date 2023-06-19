import { z, path, Router, send } from '@server/mod.ts'

import * as t from '@quasipanacea/common/types.ts'
import { dotnev } from 'std/dotenv/mod.ts'

import { pluginUtil } from '@quasipanacea/plugin-utility/server/index.ts'

export type State = {}

export function getRequests() {
	const value = Deno.env.get('GOOGLE_API_KEY')
	console.log('api key', value)
}

const trpc = pluginUtil.useTrpc<State>()

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
		.use(pluginUtil.executeAllMiddleware(trpc, hooks))
		.query(async ({ ctx, input }) => {
			const content = await Deno.readTextFile(ctx.state.latexFile)

			return {
				content,
			}
		}),
})
