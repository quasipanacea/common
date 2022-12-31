import { path, z } from "@src/mod.ts";
import * as util from "@src/util/util.ts";
import { Endpoint } from "@src/util/types.ts";

const uuid = z.string().min(1);

const initSchema = {
	req: z.object({ uuid }),
	res: z.object({}),
};
export const init: Endpoint<typeof initSchema> = {
	route: "/init",
	schema: initSchema,
	async api(pod) {
		const filepath = path.join(pod.dir, "index.md");
		try {
			const f = await Deno.open(filepath, { create: true, createNew: true });
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
	req: z.object({ uuid }),
	res: z.object({}),
};
export const read: Endpoint<typeof writeSchema> = {
	route: "/read",
	schema: readSchema,
	async api(pod) {
		const filepath = path.join(pod.dir, "index.md");
		const content = await Deno.readTextFile(filepath);
		return { content };
	},
};

const writeSchema = {
	req: z.object({ uuid, content: z.string().min(1) }),
	res: z.object({}),
};
export const write: Endpoint<typeof writeSchema> = {
	route: "/write",
	schema: writeSchema,
	async api(pod, { content }) {
		const filepath = path.join(pod.dir, "index.md");
		await Deno.writeTextFile(filepath, content);
		return {};
	},
};

const openNativelySchema = {
	req: z.object({ uuid }),
	res: z.object({}),
};
export const openNatively: Endpoint<typeof openNativelySchema> = {
	route: "/open",
	schema: openNativelySchema,
	api(pod) {
		const filepath = path.join(pod.dir, "index.md");
		Deno.run({ cmd: ["xdg-open", filepath] });
		return {};
	},
};
