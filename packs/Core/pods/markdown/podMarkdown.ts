import { z, path } from "@src/mod.ts";

import * as util from "@src/util/util.ts";

import type {
	Endpoint,
	MakeState,
	OnPodCreate,
	OnPodRemove,
} from "@src/verify/types.ts";

// HOOKS

export const onPodCreate: OnPodCreate = function (pod) {
	console.log("created", pod);
};

export const onPodRemove: OnPodRemove = function (pod) {
	console.log("removed", pod);
};

// STATE

export type State = {
	indexFile: string;
};

export const makeState: MakeState<State> = function (pod) {
	const indexFile = path.join(pod.dir, "index.md");

	return {
		indexFile,
	};
};

// TYPES

const uuid_t = z.string().min(1);

// ROUTES

const initSchema = {
	req: z.object({ uuid: uuid_t }),
	res: z.object({}),
};
export const init: Endpoint<State, typeof initSchema> = {
	route: "/init",
	schema: initSchema,
	async api(pod, state) {
		try {
			const f = await Deno.open(state.indexFile, {
				create: true,
				createNew: true,
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
};

const readSchema = {
	req: z.object({ uuid: uuid_t }),
	res: z.object({}),
};
export const read: Endpoint<State, typeof writeSchema> = {
	route: "/read",
	schema: readSchema,
	async api(pod, state) {
		const content = await Deno.readTextFile(state.indexFile);
		return { content };
	},
};

const writeSchema = {
	req: z.object({ uuid: uuid_t, content: z.string() }),
	res: z.object({}),
};
export const write: Endpoint<State, typeof writeSchema> = {
	route: "/write",
	schema: writeSchema,
	async api(pod, state, { content }) {
		await Deno.writeTextFile(state.indexFile, content);
		return {};
	},
};

const openNativelySchema = {
	req: z.object({ uuid: uuid_t }),
	res: z.object({}),
};
export const openNatively: Endpoint<State, typeof openNativelySchema> = {
	route: "/open",
	schema: openNativelySchema,
	api(pod, state) {
		util.run_bg(["xdg-open", state.indexFile]);
		return {};
	},
};
