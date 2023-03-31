import { z, path, Router, send } from '@server/mod.ts'

import * as t from '@quazipanacea/common/types.ts'
import * as util from '@quazipanacea/common/util.ts'
import * as pluginUtility from '@quazipanacea/plugin-utility/util.ts'

export type State = {
	latexFile: string
	pdfFile: string
}

export const hooks: t.Hooks<State> = {
	makeState(pod) {
		const latexFile = path.join(pod.dir, 'main.tex')
		const pdfFile = path.join(pod.dir, 'main.pdf')

		return {
			latexFile,
			pdfFile,
		}
	},
	async onPodAdd(pod, state) {
		await pluginUtility.assertFileExists(state.latexFile)
	},
}

export const oakRouter = new Router().get('/get-pdf/:podId', async (ctx) => {
	const podId = ctx.params.podId
	const pod = await util.getPod(podId)

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
		.use(pluginUtility.executeAllMiddleware(trpc, hooks))
		.mutation(async ({ ctx, input }) => {
			await Deno.writeTextFile(ctx.state.latexFile, input.content)

			const p = await Deno.run({
				stdout: 'piped',
				stderr: 'piped',
				cwd: (ctx as any).pod.dir,
				cmd: ['pdflatex', ctx.state.latexFile, ctx.state.pdfFile],
			})
			const [status, stdout, stderr] = await Promise.all([
				p.status(),
				p.output(),
				p.stderrOutput(),
			])
			p.close()
			console.log(
				status,
				new TextDecoder().decode(stdout),
				new TextDecoder().decode(stderr),
			)
			console.log('----- DONE')
		}),
})
