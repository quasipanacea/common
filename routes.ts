import { path } from "@src/mod.ts";

import { z } from "~zod";

import * as util from "@src/util/util.ts";
import * as utilResource from "@src/util/utilResource.ts";
import * as utilPlugin from "@src/util/utilPlugin.ts";
import * as t from "@common/types.ts";
import { trpc } from "@common/trpc.ts";

import { router as markdownRouter } from "@common/packs/Core/pods/markdown/podMarkdown.ts";
import { router as plaintextRouter } from "@common/packs/Core/pods/plaintext/podPlaintext.ts";

export const appRouter = trpc.router({
	plugins: trpc.router({
		pods: trpc.router({
			markdown: markdownRouter,
			plaintext: plaintextRouter,
		}),
	}),
	collectionAdd: trpc.procedure
		.input(t.Collection.omit({ uuid: true }))
		.output(z.object({ uuid: t.Uuid }))
		.mutation(async ({ input }) => {
			const uuid = crypto.randomUUID();
			const rDir = utilResource.getCollectionDir(uuid);
			const rJsonFile = utilResource.getCollectionsJsonFile();
			const rJson = await utilResource.getCollectionsJson();

			// work
			rJson.collections[uuid] = {
				name: input.name,
				pluginId: input.pluginId,
			};
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
			await Deno.mkdir(rDir, { recursive: true });

			// hook

			return {
				uuid,
			};
		}),
	collectionRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			const rDir = utilResource.getCollectionDir(input.uuid);
			const rJsonFile = utilResource.getCollectionsJsonFile();
			const rJson = await utilResource.getCollectionsJson();

			// hook

			// work
			await Deno.remove(rDir, { recursive: true });
			if (rJson.collections[input.uuid]) {
				delete rJson.collections[input.uuid];
			}
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
		}),
	collectionList: trpc.procedure
		.input(z.void())
		.output(
			z.object({
				collections: z.array(t.Collection),
			})
		)
		.query(async () => {
			const rJson = await utilResource.getCollectionsJson();

			// work
			const collections: t.Collection_t[] = [];
			for (const [uuid, obj] of Object.entries(rJson.collections)) {
				collections.push({
					uuid,
					name: obj.name,
					pluginId: obj.pluginId,
				});
			}
			return { collections };
		}),
	podAdd: trpc.procedure
		.input(
			z.object({
				name: t.String,
				collectionUuid: t.Uuid,
				pluginId: t.PodPluginId,
			})
		)
		.output(
			z.object({
				uuid: t.Uuid,
			})
		)
		.mutation(async ({ input }) => {
			const uuid = crypto.randomUUID();
			const pod: t.PodDir_t = {
				uuid,
				name: input.name,
				collectionUuid: input.collectionUuid,
				pluginId: input.pluginId,
				dir: utilResource.getPodDir(uuid),
			};
			const podsJson = await utilResource.getPodsJson();

			// work
			podsJson.pods[uuid] = {
				name: input.name,
				pluginId: input.pluginId,
				collectionUuid: input.collectionUuid,
			};
			await Deno.writeTextFile(
				utilResource.getPodsJsonFile(),
				util.jsonStringify(podsJson)
			);
			await Deno.mkdir(pod.dir, { recursive: true });

			// hook
			const hooks = await utilPlugin.getHooks(pod.pluginId);
			const state = hooks.makeState?.(pod) || {};
			if (hooks.onPodAdd) {
				await hooks.onPodAdd(pod, state);
			}

			return { uuid };
		}),
	podRemove: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
			})
		)
		.output(z.void())
		.mutation(async ({ input }) => {
			const pod = await util.getPod(input.uuid);
			const podsJson = await utilResource.getPodsJson();

			// hook
			const hooks = await utilPlugin.getHooks(pod.pluginId);
			const state = hooks.makeState?.(pod) || {};
			if (hooks.onPodAdd) {
				await hooks.onPodAdd(pod, state);
			}

			// work
			await Deno.remove(path.dirname(pod.dir), { recursive: true });
			if (podsJson.pods[input.uuid]) {
				delete podsJson.pods[input.uuid];
			}
			await Deno.writeTextFile(
				utilResource.getPodsJsonFile(),
				util.jsonStringify(podsJson)
			);

			return;
		}),
	podQuery: trpc.procedure
		.input(z.object({ uuid: t.Uuid, queryString: t.String }))
		.output(z.object({ result: t.String }))
		.query(({ input }) => {
			return {
				result: input.queryString,
			};
		}),
	podList: trpc.procedure
		.input(z.void())
		.output(
			z.object({
				pods: z.array(t.Pod),
			})
		)
		.query(async () => {
			const podsJson = await utilResource.getPodsJson();

			const pods: t.Pod_t[] = [];
			for (const [uuid, obj] of Object.entries(podsJson.pods)) {
				pods.push({
					uuid,
					...obj,
				});
			}

			return { pods };
		}),
	pluginList: trpc.procedure
		.input(z.void())
		.output(
			z.object({
				plugins: z.array(t.Plugin),
			})
		)
		.query(async () => {
			const plugins = await utilPlugin.getPluginList();
			return { plugins };
		}),
	pluginQuery: trpc.procedure
		.input(z.object({ query: t.String }))
		.output(z.object({ result: t.String }))
		.query(({ input }) => {
			return {
				result: input.query,
			};
		}),
});

export type AppRouter = typeof appRouter;
