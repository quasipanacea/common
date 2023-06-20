import { z, path } from '@server/mod.ts'

import { t } from '@quasipanacea/common/index.ts'
import { serverUtil } from '@quasipanacea/plugin-utility/server/index.ts'

export type State = {
	indexFile: string
}

export const hooks: t.Hooks<State> = {
	makeState(pod) {
		const indexFile = path.join(pod.dir, 'index.txt')

		return {
			indexFile,
		}
	},
	async onPodAdd(pod, state) {
		await serverUtil.assertFileExists(state.indexFile)
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
		.use(serverUtil.executeAllMiddleware(trpc, hooks))
		.mutation(async ({ ctx, input }) => {
			await Deno.writeTextFile(ctx.state.indexFile, input.content)
		}),
})
