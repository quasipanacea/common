import { path } from "@src/mod.ts";

import { MakeState } from "@src/verify/types.ts";

export type State = {
	indexFile: string;
};

export const makeState: MakeState<State> = function (pod) {
	const indexFile = path.join(pod.dir, "index.md");

	return {
		indexFile,
	};
};
