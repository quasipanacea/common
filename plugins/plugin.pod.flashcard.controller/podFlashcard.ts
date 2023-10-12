import * as path from 'node:path'
import { z } from 'zod'

import { t } from '@quasipanacea/common/index.ts'
import { serverUtil } from '@quasipanacea/plugin-utility/server/index.ts'
import { util } from '@quasipanacea/common/server/index.ts'

type FlashcardsJson_t = {
	cards: { frontText: string; backText: string }[]
}

export type State = {
	flashcardsJsonFile: string
}

export const hooks: t.Hooks<'pod', State> = {
	makeState({ dir }) {
		const flashcardsJsonFile = path.join(dir, 'cards.json')

		return {
			flashcardsJsonFile,
		}
	},
	async onAdd({ state }) {
		await serverUtil.assertFileExists(state.flashcardsJsonFile, '{}\n')
	},
}

const trpc = serverUtil.useTrpc<State>()
const pprocedure = serverUtil.yieldPluginProcedure(trpc, hooks)

export const pluginProcedure = trpc.procedure
	.input(
		z.object({
			uuid: t.Uuid,
		}),
	)
	.use(serverUtil.executeAllMiddleware(trpc, hooks))

export const trpcRouter = trpc.router({
	addFlashcard: pluginProcedure
		.input(
			z.object({
				frontText: t.String,
				backText: t.String,
			}),
		)
		.output(z.void())
		.mutation(async ({ ctx, input }) => {
			ctx.state

			const flashcardsJson: FlashcardsJson_t = JSON.parse(
				await Deno.readTextFile(ctx.state.flashcardsJsonFile),
			)

			if (!Array.isArray(flashcardsJson.cards)) {
				flashcardsJson.cards = []
			}

			flashcardsJson.cards.push({
				frontText: input.frontText,
				backText: input.backText,
			})

			await Deno.writeTextFile(
				ctx.state.flashcardsJsonFile,
				util.jsonStringify(flashcardsJson),
			)
		}),
	editFlashcard: pluginProcedure
		.input(
			z.object({
				index: z.number(),
				frontText: t.String,
				backText: t.String,
			}),
		)
		.output(z.void())
		.mutation(async ({ ctx, input }) => {
			const flashcardsJson: FlashcardsJson_t = JSON.parse(
				await Deno.readTextFile(ctx.state.flashcardsJsonFile),
			)

			if (!Array.isArray(flashcardsJson.cards)) {
				flashcardsJson.cards = []
			}

			if (input.index < 0 || input.index >= flashcardsJson.cards.length) {
				throw new Error('Index out of range')
			}

			flashcardsJson.cards.splice(input.index, 1, {
				frontText: input.frontText,
				backText: input.backText,
			})

			await Deno.writeTextFile(
				ctx.state.flashcardsJsonFile,
				util.jsonStringify(flashcardsJson),
			)
		}),
	readFlashcards: pluginProcedure
		.output(
			z.array(
				z.object({
					frontText: t.String,
					backText: t.String,
				}),
			),
		)
		.query(async ({ ctx, input }) => {
			const flashcardsJson: FlashcardsJson_t = JSON.parse(
				await Deno.readTextFile(ctx.state.flashcardsJsonFile),
			)

			return flashcardsJson.cards || []
		}),
})
