import { trpc } from "@common/trpc.ts";
import { coreRouter } from "@common/routes.ts";

import { trpcRouter } from "./podChemical.js";

export const inferenceOnlyAppRouter = trpc.router({
	core: coreRouter,
	plugins: trpc.router({
		pods: trpc.router({
			chemical: trpcRouter,
		}),
	}),
});
export type InferenceOnlyAppRouter = typeof inferenceOnlyAppRouter;
