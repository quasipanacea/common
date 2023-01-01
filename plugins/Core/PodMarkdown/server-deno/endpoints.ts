import { path, z } from "@src/mod.ts";
import * as util from "@src/util/util.ts";
import { Endpoint, Pod } from "@src/util/types.ts";

// Types

const uuid_t = z.string().min(1);

// State

type State = {
	indexFile: string;
};

export function getState(pod: Pod): State {
	const indexFile = path.join(pod.dir, "index.md");

	return {
		indexFile,
	};
}

// Routes

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
	req: z.object({ uuid: uuid_t, content: z.string().min(1) }),
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
		Deno.run({ cmd: ["xdg-open", state.indexFile] });
		return {};
	},
};
