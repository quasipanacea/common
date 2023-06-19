import { z, path, Router, send } from '@server/mod.ts'

import * as t from '@quasipanacea/common/types.ts'
import * as util from '@quasipanacea/common/server/util.ts'
import * as pluginUtility from '@quasipanacea/plugin-utility/util.ts'

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
	await send(ctx, pdfFile.slice('/home/edwin'.length), {
		root: '/home/edwin', // TODO
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

			await convertLatexToPdf(
				ctx.pod.dir,
				ctx.state.latexFile,
				ctx.state.pdfFile,
			)
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
