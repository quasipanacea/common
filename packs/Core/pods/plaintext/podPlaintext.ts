import { z, path } from "@src/mod.ts";

import * as util from "@common/deno/util.ts";
import * as t from "@common/types.ts";
import { trpc } from "@common/trpc.ts";

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
	async onPodAdd(pod) {
		console.log("plaintext added", pod);
	},
	async onPodRemove(pod) {
		console.log("plaintext removed", pod);
	},
};

export const router = trpc.router({
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
		.query(async () => {
			const content = await Deno.readTextFile(state.indexFile);

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
		.mutation(async () => {
			await Deno.writeTextFile(state.indexFile, input.content);
		}),
	open: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
			})
		)
		.output(z.void())
		.mutation(({ input }) => {
			util.run_bg(["xdg-open", state.indexFile]);

			return;
		}),
});
