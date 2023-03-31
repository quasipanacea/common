import { trpc } from "@common/trpc.ts";
import { coreRouter } from "@common/routes.ts";

import { trpcRouter } from "./podMarkdown.js";

export const inferenceOnlyAppRouter = trpc.router({
	core: coreRouter,
	plugins: trpc.router({
		pods: trpc.router({
			markdown: trpcRouter,
		}),
	}),
});
export type InferenceOnlyAppRouter = typeof inferenceOnlyAppRouter;
