import { path } from "@src/mod.ts";

import { z } from "~zod";

import * as util from "@src/util/util.ts";
import * as utilResource from "@src/util/utilResource.ts";
import * as utilPlugin from "@src/util/utilPlugin.ts";
import * as t from "@common/types.ts";
import { trpc } from "@common/trpc.ts";

export const coreRouter = trpc.router({
	podAdd: trpc.procedure
		.input(
			z.object({
				name: t.String,
				groupUuid: t.Uuid,
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
				groupUuid: input.groupUuid,
				pluginId: input.pluginId,
				dir: utilResource.getPodDir(uuid),
			};
			const podsJson = await utilResource.getPodsJson();

			// work
			podsJson.pods[uuid] = {
				name: input.name,
				pluginId: input.pluginId,
				groupUuid: input.groupUuid,
			};
			await Deno.writeTextFile(
				utilResource.getPodsJsonFile(),
				util.jsonStringify(podsJson)
			);
			await Deno.mkdir(pod.dir, { recursive: true });

			// hook
			const hooks = await utilPlugin.getHooks(pod.pluginId);
			const state = (await hooks.makeState?.(pod)) || {};
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
			const state = (await hooks.makeState?.(pod)) || {};
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
	podRename: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				newName: t.String,
			})
		)
		.output(z.void())
		.mutation(async ({ input }) => {
			const podsJson = await utilResource.getPodsJson();

			podsJson.pods[input.uuid].name = input.newName;
			await Deno.writeTextFile(
				utilResource.getPodsJsonFile(),
				util.jsonStringify(podsJson)
			);
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

	groupAdd: trpc.procedure
		.input(t.Group.omit({ uuid: true }))
		.output(z.object({ uuid: t.Uuid }))
		.mutation(async ({ input }) => {
			const uuid = crypto.randomUUID();
			const rDir = utilResource.getGroupDir(uuid);
			const rJsonFile = utilResource.getGroupsJsonFile();
			const rJson = await utilResource.getGroupsJson();

			// work
			rJson.groups[uuid] = {
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
	groupRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			const rDir = utilResource.getGroupDir(input.uuid);
			const rJsonFile = utilResource.getGroupsJsonFile();
			const rJson = await utilResource.getGroupsJson();

			// hook

			// work
			await Deno.remove(rDir, { recursive: true });
			if (rJson.groups[input.uuid]) {
				delete rJson.groups[input.uuid];
			}
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
		}),
	groupRename: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				newName: t.String,
			})
		)
		.output(z.void())
		.mutation(async ({ input }) => {
			const rJsonFile = utilResource.getGroupsJsonFile();
			const rJson = await utilResource.getGroupsJson();

			rJson.groups[input.uuid].name = input.newName;
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
		}),
	groupList: trpc.procedure
		.input(z.void())
		.output(
			z.object({
				groups: z.array(t.Group),
			})
		)
		.query(async () => {
			const rJson = await utilResource.getGroupsJson();

			// work
			const groups: t.Group_t[] = [];
			for (const [uuid, obj] of Object.entries(rJson.groups)) {
				groups.push({
					uuid,
					name: obj.name,
					pluginId: obj.pluginId,
				});
			}
			return { groups };
		}),

	coverAdd: trpc.procedure
		.input(t.Cover.omit({ uuid: true }))
		.output(z.object({ uuid: t.Uuid }))
		.mutation(async ({ input }) => {
			const uuid = crypto.randomUUID();
			const rDir = utilResource.getCoverDir(uuid);
			const rJsonFile = utilResource.getCoversJsonFile();
			const rJson = await utilResource.getCoversJson();

			// work
			rJson.covers[uuid] = {
				name: input.name,
				pluginId: input.pluginId,
				groupUuid: input.groupUuid,
			};
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
			await Deno.mkdir(rDir, { recursive: true });

			// hook

			return {
				uuid,
			};
		}),
	coverRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			const rDir = utilResource.getCoverDir(input.uuid);
			const rJsonFile = utilResource.getCoversJsonFile();
			const rJson = await utilResource.getCoversJson();

			// hook

			// work
			await Deno.remove(rDir, { recursive: true });
			if (rJson.covers[input.uuid]) {
				delete rJson.covers[input.uuid];
			}
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
		}),
	coverRename: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				newName: t.String,
			})
		)
		.output(z.void())
		.mutation(async ({ input }) => {
			const rJsonFile = utilResource.getCoversJsonFile();
			const rJson = await utilResource.getCoversJson();

			rJson.covers[input.uuid].name = input.newName;
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
		}),
	coverList: trpc.procedure
		.input(z.void())
		.output(
			z.object({
				covers: z.array(t.Cover),
			})
		)
		.query(async () => {
			const rJson = await utilResource.getCoversJson();

			// work
			const covers: t.Cover_t[] = [];
			for (const [uuid, obj] of Object.entries(rJson.covers)) {
				covers.push({
					uuid,
					name: obj.name,
					pluginId: obj.pluginId,
					groupUuid: obj.groupUuid,
				});
			}
			return { covers };
		}),

	overviewSaveLayout: trpc.procedure
		.input(
			z.object({
				nodes: z.array(t.NodeLayout.passthrough()),
			})
		)
		.output(z.void())
		.mutation(async ({ input }) => {
			await Deno.writeTextFile(
				"/home/edwin/temp.json",
				util.jsonStringify(input)
			);
		}),
	overviewGetSavedLayout: trpc.procedure
		.input(z.void())
		.output(
			z.object({
				nodes: z.array(t.NodeLayout.passthrough()),
			})
		)
		.mutation(async () => {
			const obj = await Deno.readTextFile("/home/edwin/temp.json");
			return JSON.parse(obj);
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

const bareAppRouter = trpc.router({
	core: coreRouter,
});
export type BareAppRouter = typeof bareAppRouter;
