import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import type { InferenceOnlyAppRouter } from "./s";

export const inferenceOnlyApi = createTRPCProxyClient<InferenceOnlyAppRouter>({
	links: [
		httpBatchLink({
			url: "/trpc",
		}),
	],
});
export type InferenceOnlyApi = typeof inferenceOnlyApi;
