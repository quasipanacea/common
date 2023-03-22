import { trpc } from "@common/trpc.ts";
import { coreRouter } from "@common/routes.ts";

import { trpcRouter } from "./podPlaintext.ts";

export const inferenceOnlyAppRouter = trpc.router({
	core: coreRouter,
	plugins: trpc.router({
		pods: trpc.router({
			plaintext: trpcRouter,
		}),
	}),
});
export type InferenceOnlyAppRouter = typeof inferenceOnlyAppRouter;