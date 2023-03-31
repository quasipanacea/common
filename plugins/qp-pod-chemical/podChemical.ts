import { z, path, Router, send } from '@server/mod.ts'

import * as t from './dependencies/@quazipanacea/common/types.ts'
import * as pluginUtility from '@quazipanacea/plugin-utility/util.ts'

export type State = {
	dataFile: string
}

export const hooks: t.Hooks<State> = {
	makeState(pod) {
		const dataFile = path.join(pod.dir, 'data.json')

		return {
			dataFile,
		}
	},
	async onPodAdd(pod, state) {
		await pluginUtility.assertFileExists(state.dataFile)
	},
}

export const oakRouter = new Router().get('/get-pdf/:podId', async (ctx) => {
	const podId = ctx.params.podId
	const pod = await pluginUtility.getPod(podId)

	const pdfFile = path.join(pod.dir, 'main.pdf')
	console.log(pdfFile)

	await send(ctx, pdfFile.slice('/home/edwin'.length), {
		root: '/home/edwin',
	})
})

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
		.query(async ({ ctx }) => {
			const content = await Deno.readTextFile(ctx.state.dataFile)

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
		.use(pluginUtility.executeAllMiddleware(trpc, hooks))
		.mutation(async ({ ctx, input }) => {
			await Deno.writeTextFile(ctx.state.dataFile, input.content)
		}),
})
