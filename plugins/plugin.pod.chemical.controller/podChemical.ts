import * as path from 'node:path'
import express from 'express'
import { z } from 'zod'

import { t } from '@quasipanacea/common/index.ts'
import { serverUtil } from '@quasipanacea/plugin-utility/server/index.ts'

export type State = {
	dataFile: string
}

export const hooks: t.Hooks<'pod', State> = {
	makeState({ dir }) {
		const dataFile = path.join(dir, 'data.json')

		return {
			dataFile,
		}
	},
	async onAdd({ state }) {
		await serverUtil.assertFileExists(state.dataFile)
	},
}

export const oakRouter = express
	.Router()
	.get('/get-pdf/:podUuid', async (ctx: Router) => {
		const podUuid = ctx.params.podUuid
		const { resource: pod } = await utilPlugin.getResource('pods', podUuid)

		const pdfFile = path.join(pod.dir, 'main.pdf')
		console.log(pdfFile)

		await send(ctx, pdfFile.slice('/home/edwin'.length), {
			root: '/home/edwin',
		})
	})

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
		.use(serverUtil.executeAllMiddleware(trpc, hooks))
		.mutation(async ({ ctx, input }) => {
			await Deno.writeTextFile(ctx.state.dataFile, input.content)
		}),
})
