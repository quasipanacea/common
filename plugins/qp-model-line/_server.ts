import { z, path, Router, send } from '@server/mod.ts'

import * as t from '@quasipanacea/common/types.ts'
import { dotnev } from 'std/dotenv/mod.ts'

import * as pluginUtility from '@quasipanacea/plugin-utility/util.ts'

export type State = {}

export function getRequests() {
	const value = Deno.env.get('GOOGLE_API_KEY')
	console.log('api key', value)
}

const trpc = pluginUtility.useTrpc<State>()

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
		.use(pluginUtility.executeAllMiddleware(trpc, hooks))
		.query(async ({ ctx, input }) => {
			const content = await Deno.readTextFile(ctx.state.latexFile)

			return {
				content,
			}
		}),
})
