import { z, path } from "@src/mod.ts";

import { trpc } from "@common/trpc.ts";
import * as t from "@common/types.ts";
import * as util from "@common/shared/util/util.ts";

export type State = {
	indexFile: string;
};

export const hooks: t.Hooks<State> = {
	makeState(pod) {
		const indexFile = path.join(pod.dir, "index.txt");

		return {
			indexFile,
		};
	},
	async onPodAdd(pod, state) {
		await util.assertFileExists(state.indexFile);
	},
};

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
		.use(util.stuffPod(trpc))
		.use(util.stuffState(trpc, hooks))
		.query(async ({ ctx }) => {
			const content = await Deno.readTextFile(ctx.state.indexFile);

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
		.use(util.stuffPod(trpc))
		.use(util.stuffState(trpc, hooks))
		.mutation(async ({ ctx, input }) => {
			await Deno.writeTextFile(ctx.state.indexFile, input.content);
		}),
	open: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
			})
		)
		.output(z.void())
		.use(util.stuffPod(trpc))
		.use(util.stuffState(trpc, hooks))
		.mutation(({ ctx, input }) => {
			util.run_bg(["xdg-open", ctx.state.indexFile]);

			return;
		}),
});
