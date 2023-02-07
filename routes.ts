import { initTRPC } from "~trpc-server";
import { z } from "~zod";

import * as util from "@src/util/util.ts";
import * as utilResource from "@src/util/utilResource.ts";
import * as utilPlugin from "@src/util/utilPlugin.ts";
import {
	uuid_t,
	name_t,
	string_t,
	zodPod,
	zodPlugin,
	zodCollection,
} from "@common/types.ts";

const t = initTRPC.create();

export const appRouter = t.router({
	collectionAdd: t.procedure
		.input(zodCollection.omit({ uuid: true }))
		.output(z.object({ uuid: uuid_t }))
		.mutation(async ({ input }) => {
			const uuid = crypto.randomUUID();
			const rDir = utilResource.getCollectionDir(uuid);
			const rJsonFile = await utilResource.getCollectionsJsonFile();
			const rJson = await utilResource.getCollectionsJson();

			// work
			rJson.collections[uuid] = {
				name: input.name,
				owningPlugin: input.owningPlugin,
			};
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
			await Deno.mkdir(rDir, { recursive: true });

			// hook

			return {
				uuid,
			};
		}),
	collectionRemove: t.procedure
		.input(z.object({ uuid: uuid_t }))
		.output(z.void())
		.mutation(async ({ input }) => {
			const rDir = utilResource.getCollectionDir(input.uuid);
			const rJsonFile = await utilResource.getCollectionsJsonFile();
			const rJson = await utilResource.getCollectionsJson();

			// hook

			// work
			await Deno.remove(rDir, { recursive: true });
			if (rJson.collections[input.uuid]) {
				delete rJson.collections[input.uuid];
			}
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
		}),
	collectionList: t.procedure
		.input(z.void())
		.output(
			z.object({
				collections: z.array(zodCollection),
			})
		)
		.query(async () => {
			const rJson = await utilResource.getCollectionsJson();

			// work
			const collections: z.infer<typeof zodCollection>[] = [];
			for (const [uuid, obj] of Object.entries(rJson.collections)) {
				collections.push({
					uuid,
					name: obj.handler,
					handler: obj.handler,
				});
			}
			return { collections };
		}),
	pluginList: t.procedure
		.input(z.void())
		.output(
			z.object({
				plugins: z.array(typeof zodPlugin),
			})
		)
		.query(async () => {
			const plugins = await utilPlugin.getPluginList();
			return { plugins };
		}),
});

export type AppRouter = typeof appRouter;
