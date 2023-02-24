import { z, path, TRPCError } from "@src/mod.ts";

import * as util2 from "@src/util/util.ts";
import * as utilResource from "@src/util/utilResource.ts";
import * as util from "@common/deno/util.ts";
import * as t from "@common/types.ts";
import { trpc } from "@common/trpc.ts";

export type State = {
	indexFile: string;
};

export const hooks: t.Hooks<State> = {
	makeState(pod) {
		const indexFile = path.join(pod.dir, "index.md");

		return {
			indexFile,
		};
	},
	async onPodAdd(pod, state) {
		console.log("markdown added");
		try {
			const f = await Deno.open(state.indexFile, {
				createNew: true,
				write: true,
			});
			f.close();
		} catch (err: unknown) {
			if (!(err instanceof Deno.errors.AlreadyExists)) {
				if (err instanceof Error) {
					throw err;
				} else {
					throw new Error(JSON.stringify(err));
				}
			}
		}
	},
	async onPodRemove(pod) {
		console.log("markdown removed", pod);
	},
};

const stuffPod = trpc.middleware(async ({ ctx, input, next }) => {
	if ((input as any).uuid) {
		const uuid = (input as any).uuid;

		ctx.pod = await util2.getPod(uuid);
	}

	if (!ctx.pod) {
		throw new TRPCError({ code: "PRECONDITION_FAILED" });
	}

	return next({
		ctx: {
			pod: ctx.pod,
		},
	});
});

const stuffState = trpc.middleware(async ({ ctx, next }) => {
	if (!ctx.pod) {
		throw new TRPCError({ code: "PRECONDITION_FAILED" });
	}

	if (hooks.makeState) {
		ctx.state = await hooks.makeState(ctx.pod);
	}

	if (!ctx.state) {
		throw new TRPCError({ code: "PRECONDITION_FAILED" });
	}

	return next({
		ctx: {
			state: ctx.state,
		},
	});
});

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
		.use(stuffPod)
		.use(stuffState)
		.query(async ({ ctx, input }) => {
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
		.use(stuffPod)
		.use(stuffState)
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
		.use(stuffPod)
		.use(stuffState)
		.mutation(({ ctx }) => {
			util.run_bg(["xdg-open", ctx.state.indexFile]);

			return;
		}),
});
