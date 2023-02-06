import { initTRPC } from "npm:@trpc/server";
import { z } from "npm:zod";

import * as util from "@src/util/util.ts";
import * as utilResource from "@src/util/utilResource.ts";
import * as utilPlugin from "@src/util/utilPlugin.ts";
import * as schemas from "@src/verify/schemas.ts";

const t = initTRPC.create();

const uuid_t = z.string().min(1);
const name_t = z.string().min(1);
const handler_t = z.string().min(1);

export const appRouter = t.router({
	collectionAdd: t.procedure
		.input(z.object({ name: name_t, handler: z.string().min(1) }))
		.output(z.object({ uuid: uuid_t }))
		.mutation(async ({ input }) => {
			const uuid = crypto.randomUUID();
			const rDir = utilResource.getResourceDir("collections", uuid);
			const rJsonFile = await utilResource.getResourceJsonFile("collections");
			const rJson = await utilResource.getResourceJson<
				typeof schemas.ResourceSchemaCollections
			>("collections", schemas.ResourceSchemaCollections);

			// work
			rJson.collections[uuid] = {
				name: input.name,
				handler: input.handler,
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
			const rDir = utilResource.getResourceDir("collections", input.uuid);
			const rJsonFile = await utilResource.getResourceJsonFile("collections");
			const rJson = await utilResource.getResourceJson<
				typeof schemas.ResourceSchemaCollections
			>("collections", schemas.ResourceSchemaCollections);

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
				collections: z.array(
					z.object({
						uuid: uuid_t,
						name: name_t,
						handler: handler_t,
					})
				),
			})
		)
		.mutation(async () => {
			const rJson = await utilResource.getResourceJson<
				typeof schemas.ResourceSchemaCollections
			>("collections", schemas.ResourceSchemaCollections);

			// work
			const collections = [];
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
				plugins: z.array(
					z.object({
						name: name_t,
						resource: z.string().min(1),
						dir: z.string().min(1),
						pack: z.string().min(1),
					})
				),
			})
		)
		.query(async () => {
			const plugins = await utilPlugin.getPluginList();
			return { plugins };
		}),
});

export type AppRouter = typeof appRouter;
