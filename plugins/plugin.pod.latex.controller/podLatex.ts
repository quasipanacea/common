import * as path from 'node:path'
import express, { Request, Response } from 'express'
import { z } from 'zod'

import { t } from '@quasipanacea/common/index.ts'
import { util, utilPlugin } from '@quasipanacea/common/server/index.ts'
import { serverUtil } from '@quasipanacea/plugin-utility/server/index.ts'

export type State = {
	latexFile: string
	pdfFile: string
}

export const hooks: t.Hooks<'pod', State> = {
	makeState({ dir }) {
		const latexFile = path.join(dir, 'main.tex')
		const pdfFile = path.join(dir, 'main.pdf')

		return {
			latexFile,
			pdfFile,
		}
	},
	async onAdd({ state }) {
		await serverUtil.assertFileExists(state.latexFile)
	},
}

export const oakRouter = express
	.Router()
	.get('/get-pdf/:podUuid', async (ctx: Context) => {
		const podUuid = ctx.params.podUuid
		const pod = await utilPlugin.getResource('pods', podUuid)

		const pdfFile = path.join(pod.dir, 'main.pdf')
		await send(ctx, pdfFile.slice('/home/edwin'.length), {
			root: '/home/edwin', // TODO
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
		.query(async ({ ctx, input }) => {
			const content = await Deno.readTextFile(ctx.state.latexFile)

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
			await Deno.writeTextFile(ctx.state.latexFile, input.content)

			await convertLatexToPdf(ctx.dir, ctx.state.latexFile, ctx.state.pdfFile)
		}),
})

async function convertLatexToPdf(
	podDir: string,
	latexFile: string,
	pdfFile: string,
) {
	console.log('converting', podDir, latexFile, pdfFile)

	const command = new Deno.Command('pdflatex', {
		args: [latexFile, pdfFile],
		cwd: podDir,
		stdout: 'piped',
		stderr: 'piped',
	})
	const { code, stdout, stderr } = await command.output()
	console.info(
		code,
		new TextDecoder().decode(stdout),
		new TextDecoder().decode(stderr),
	)
	console.info('----- DONE')
}
