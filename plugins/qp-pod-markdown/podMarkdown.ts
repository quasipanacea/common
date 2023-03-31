import { z, path } from '@server/mod.ts'

import * as t from '@quazipanacea/common/types.ts'
import * as util from '@quazipanacea/common/util.ts'

export type State = {
	indexFile: string
}

export const hooks: t.Hooks<State> = {
	makeState(pod) {
		const indexFile = path.join(pod.dir, 'index.md')

		return {
			indexFile,
		}
	},
	async onPodAdd(pod, state) {
		await util.assertFileExists(state.indexFile)
	},
}

const trpc = util.useTrpc<State>()

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
		.use(util.executeAllMiddleware(trpc, hooks))
		.query(async ({ ctx }) => {
			const content = await Deno.readTextFile(ctx.state.indexFile)

			return {
				content,
			}
		}),
	write: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				content: z.string(),
			}),
		)
		.output(z.void())
		.use(util.executeAllMiddleware(trpc, hooks))
		.mutation(async ({ ctx, input }) => {
			await Deno.writeTextFile(ctx.state.indexFile, input.content)
		}),
})
