import { z, path, Router, send } from "@src/mod.ts";

import * as t from "@common/types.ts";
import * as util from "@common/shared/util/util.ts";
import * as srcUtil from "@src/util/util.ts";

export type State = {
	dataFile: string;
};

export const hooks: t.Hooks<State> = {
	makeState(pod) {
		const dataFile = path.join(pod.dir, "data.json");

		return {
			dataFile,
		};
	},
	async onPodAdd(pod, state) {
		await util.assertFileExists(state.dataFile);
	},
};

export const oakRouter = new Router().get("/get-pdf/:podId", async (ctx) => {
	const podId = ctx.params.podId;
	const pod = await srcUtil.getPod(podId);

	const pdfFile = path.join(pod.dir, "main.pdf");
	console.log(pdfFile);

	await send(ctx, pdfFile.slice("/home/edwin".length), {
		root: "/home/edwin",
	});
});

const trpc = util.useTrpc<State>();

export const trpcRouter = trpc.router({
	read: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
			})
		)
		.output(
			z.object({
				content: z.string(),
			})
		)
		.use(util.executeAllMiddleware(trpc, hooks))
		.query(async ({ ctx }) => {
			const content = await Deno.readTextFile(ctx.state.dataFile);

			return {
				content,
			};
		}),
	write: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				content: z.string(),
			})
		)
		.output(z.void())
		.use(util.executeAllMiddleware(trpc, hooks))
		.mutation(async ({ ctx, input }) => {
			await Deno.writeTextFile(ctx.state.dataFile, input.content);
		}),
});
