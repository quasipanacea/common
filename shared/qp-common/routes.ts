import { path, z } from './mod.ts'

import * as util from './util.ts'
import * as utilResource from './utilResource.ts'
import * as utilPlugin from './utilPlugin.ts'
import * as t from './types.ts'
import { trpc } from './trpc.ts'

export const coreRouter = trpc.router({
	orbAdd: trpc.procedure
		.input(t.Orb.omit({ uuid: true }))
		.output(z.object({ uuid: t.Uuid }))
		.mutation(async ({ input }) => {
			const uuid = await utilResource.resourceAdd(
				input,
				utilResource.getOrbsJsonFile(),
				utilResource.getOrbsJson,
				'orbs',
			)

			return { uuid }
		}),
	orbRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			await utilResource.resourceRemove(
				input,
				utilResource.getOrbsJsonFile(),
				utilResource.getOrbsJson,
				'orbs',
			)
		}),
	orbModify: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				data: t.Orb.omit({ uuid: true }).partial(),
			}),
		)
		.output(t.Orb)
		.mutation(async ({ input }) => {
			const r = await utilResource.resourceModify<t.Orb_t>(
				input,
				utilResource.getOrbsJsonFile(),
				utilResource.getOrbsJson,
				'orbs',
			)

			return r
		}),
	orbList: trpc.procedure
		.input(z.object({
			model: z.object({
				uuid: t.Uuid,
			}),
		}).optional())
		.output(
			z.object({
				orbs: z.array(t.Orb),
			}),
		)
		.query(async ({ input }) => {
			let orbs = await utilResource.resourceList<t.Orb_t>(
				utilResource.getOrbsJson,
				'orbs',
			)

			if (input?.model?.uuid) {
				orbs = orbs.filter((orb) => orb.model.uuid === input.model.uuid)
			}

			return { orbs }
		}),

	linkAdd: trpc.procedure
		.input(t.Link.omit({ uuid: true }))
		.output(z.object({ uuid: t.Uuid }))
		.mutation(async ({ input }) => {
			const uuid = await utilResource.resourceAdd(
				input,
				utilResource.getLinksJsonFile(),
				utilResource.getLinksJson,
				'links',
			)

			return { uuid }
		}),
	linkRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			await utilResource.resourceRemove(
				input,
				utilResource.getLinksJsonFile(),
				utilResource.getLinksJson,
				'links',
			)
		}),
	linkModify: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				data: t.Link.omit({ uuid: true }).partial(),
			}),
		)
		.output(t.Link)
		.mutation(async ({ input }) => {
			const r = await utilResource.resourceModify<t.Link_t>(
				input,
				utilResource.getLinksJsonFile(),
				utilResource.getLinksJson,
				'links',
			)

			return r
		}),
	linkList: trpc.procedure
		.input(z.void())
		.output(
			z.object({
				links: z.array(t.Link),
			}),
		)
		.query(async () => {
			const links = await utilResource.resourceList<t.Link_t>(
				utilResource.getLinksJson,
				'links',
			)

			return { links }
		}),

	modelAdd: trpc.procedure
		.input(t.Model.omit({ uuid: true }))
		.output(z.object({ uuid: t.Uuid }))
		.mutation(async ({ input }) => {
			const uuid = await utilResource.resourceAdd(
				input,
				utilResource.getModelsJsonFile(),
				utilResource.getModelsJson,
				'models',
			)

			return { uuid }
		}),
	modelRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			await utilResource.resourceRemove(
				input,
				utilResource.getModelsJsonFile(),
				utilResource.getModelsJson,
				'models',
			)
		}),
	modelModify: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				data: t.Model.omit({ uuid: true }).partial(),
			}),
		)
		.output(t.Model)
		.mutation(async ({ input }) => {
			const resource = await utilResource.resourceModify<t.Model_t>(
				input,
				utilResource.getModelsJsonFile(),
				utilResource.getModelsJson,
				'models',
			)

			return resource
		}),
	modelList: trpc.procedure
		.input(z.void())
		.output(
			z.object({
				models: z.array(t.Model),
			}),
		)
		.query(async () => {
			const models = await utilResource.resourceList<t.Model_t>(
				utilResource.getModelsJson,
				'models',
			)

			return { models }
		}),

	podAdd: trpc.procedure
		.input(t.Pod.omit({ uuid: true }))
		.output(
			z.object({
				uuid: t.Uuid,
			}),
		)
		.mutation(async ({ input }) => {
			const uuid = crypto.randomUUID()
			const pod: t.PodDir_t = {
				...input,
				uuid,
				dir: utilResource.getPodDir(uuid),
			}
			const podsJson = await utilResource.getPodsJson()

			// work
			podsJson.pods[uuid] = {
				...input,
			}
			await Deno.writeTextFile(
				utilResource.getPodsJsonFile(),
				util.jsonStringify(podsJson),
			)
			await Deno.mkdir(pod.dir, { recursive: true })

			// hook
			const hooks = await utilPlugin.getHooks(pod.plugin)
			const state = (await hooks.makeState?.(pod)) || {}
			if (hooks.onPodAdd) {
				await hooks.onPodAdd(pod, state)
			}

			return { uuid }
		}),
	podRemove: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
			}),
		)
		.output(z.void())
		.mutation(async ({ input }) => {
			const pod = await util.getPod(input.uuid)
			const rJson = await utilResource.getPodsJson()

			// hook
			const hooks = await utilPlugin.getHooks(pod.plugin)
			const state = (await hooks.makeState?.(pod)) || {}
			if (hooks.onPodAdd) {
				await hooks.onPodAdd(pod, state)
			}

			// work
			await Deno.remove(path.dirname(pod.dir), { recursive: true })
			if (rJson.pods[input.uuid]) {
				delete rJson.pods[input.uuid]
			}
			await Deno.writeTextFile(
				utilResource.getPodsJsonFile(),
				util.jsonStringify(rJson),
			)

			return
		}),
	podModify: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				data: t.Pod.omit({ uuid: true }).partial(),
			}),
		)
		.output(t.Pod)
		.mutation(async ({ input }) => {
			const r = await utilResource.resourceModify<t.Pod_t>(
				input,
				utilResource.getPodsJsonFile(),
				utilResource.getPodsJson,
				'pods',
			)

			return r
		}),
	podRename: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				newName: t.String,
			}),
		)
		.output(z.void())
		.mutation(async ({ input }) => {
			const rJson = await utilResource.getPodsJson()

			rJson.pods[input.uuid].name = input.newName
			await Deno.writeTextFile(
				utilResource.getPodsJsonFile(),
				util.jsonStringify(rJson),
			)
		}),
	podMutate: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				newData: t.Pod.omit({ uuid: true }).partial(),
			}),
		)
		.output(t.Pod.omit({ uuid: true }))
		.mutation(async ({ input }) => {
			const rJson = await utilResource.getPodsJson()

			if (!(input.uuid in rJson.pods)) {
				throw new Error(`Failed to find pod ${input.uuid}`)
			}

			rJson.pods[input.uuid] = {
				...rJson.pods[input.uuid],
				...input.newData,
			}
			await Deno.writeTextFile(
				utilResource.getPodsJsonFile(),
				util.jsonStringify(rJson),
			)

			return rJson.pods[input.uuid]
		}),
	podQuery: trpc.procedure
		.input(z.object({ uuid: t.Uuid, queryString: t.String }))
		.output(z.object({ result: t.String }))
		.query(({ input }) => {
			return {
				result: input.queryString,
			}
		}),
	podList: trpc.procedure
		.input(z.object({
			model: z.object({
				uuid: t.Uuid
			})
		}).optional())
		.output(
			z.object({
				pods: z.array(t.Pod),
			}),
		)
		.query(async ({ input }) => {
			const rJson = await utilResource.getPodsJson()

			let pods: t.Pod_t[] = []
			for (const [uuid, obj] of Object.entries(rJson.pods)) {
				pods.push({
					uuid,
					...obj,
				})
			}

			if (input?.model?.uuid) {
				pods = pods.filter((p) => p.model?.uuid === input?.model?.uuid)
			}

			return { pods }
		}),

	groupAdd: trpc.procedure
		.input(t.Group.omit({ uuid: true }))
		.output(z.object({ uuid: t.Uuid }))
		.mutation(async ({ input }) => {
			const uuid = crypto.randomUUID()
			const rDir = utilResource.getGroupDir(uuid)
			const rJsonFile = utilResource.getGroupsJsonFile()
			const rJson = await utilResource.getGroupsJson()

			// work
			rJson.groups[uuid] = {
				name: input.name,
				plugin: input.plugin,
			}
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))
			await Deno.mkdir(rDir, { recursive: true })

			// hook

			return {
				uuid,
			}
		}),
	groupRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			const rDir = utilResource.getGroupDir(input.uuid)
			const rJsonFile = utilResource.getGroupsJsonFile()
			const rJson = await utilResource.getGroupsJson()

			// hook

			// work
			await Deno.remove(rDir, { recursive: true })
			if (rJson.groups[input.uuid]) {
				delete rJson.groups[input.uuid]
			}
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))
		}),
	groupModify: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				data: t.Group.omit({ uuid: true }).partial(),
			}),
		)
		.output(t.Group)
		.mutation(async ({ input }) => {
			const r = await utilResource.resourceModify<t.Group_t>(
				input,
				utilResource.getGroupsJsonFile(),
				utilResource.getGroupsJson,
				'groups',
			)

			return r
		}),
	groupRename: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				newName: t.String,
			}),
		)
		.output(z.void())
		.mutation(async ({ input }) => {
			const rJsonFile = utilResource.getGroupsJsonFile()
			const rJson = await utilResource.getGroupsJson()

			rJson.groups[input.uuid].name = input.newName
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))
		}),
	groupMutate: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				newData: t.Group.omit({ uuid: true }).partial(),
			}),
		)
		.output(t.Group.omit({ uuid: true }))
		.mutation(async ({ input }) => {
			const rJson = await utilResource.getGroupsJson()

			if (!(input.uuid in rJson.groups)) {
				throw new Error(`Failed to find group ${input.uuid}`)
			}

			rJson.groups[input.uuid] = {
				...rJson.groups[input.uuid],
				...input.newData,
			}
			await Deno.writeTextFile(
				utilResource.getGroupsJsonFile(),
				util.jsonStringify(rJson),
			)

			return rJson.groups[input.uuid]
		}),
	groupList: trpc.procedure
		.input(z.void())
		.output(
			z.object({
				groups: z.array(t.Group),
			}),
		)
		.query(async () => {
			const rJson = await utilResource.getGroupsJson()

			// work
			const groups: t.Group_t[] = []
			for (const [uuid, obj] of Object.entries(rJson.groups)) {
				groups.push({
					uuid,
					...obj,
				})
			}
			return { groups }
		}),

	viewAdd: trpc.procedure
		.input(t.View.omit({ uuid: true }))
		.output(z.object({ uuid: t.Uuid }))
		.mutation(async ({ input }) => {
			const uuid = crypto.randomUUID()
			const rDir = utilResource.getViewDir(uuid)
			const rJsonFile = utilResource.getViewsJsonFile()
			const rJson = await utilResource.getViewsJson()

			// work
			rJson.views[uuid] = {
				name: input.name,
				plugin: input.plugin,
				groupUuid: input.groupUuid,
			}
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))
			await Deno.mkdir(rDir, { recursive: true })

			// hook

			return {
				uuid,
			}
		}),
	viewRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			const rDir = utilResource.getViewDir(input.uuid)
			const rJsonFile = utilResource.getViewsJsonFile()
			const rJson = await utilResource.getViewsJson()

			// hook

			// work
			await Deno.remove(rDir, { recursive: true })
			if (rJson.views[input.uuid]) {
				delete rJson.views[input.uuid]
			}
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))
		}),
	viewModify: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				data: t.View.omit({ uuid: true }).partial(),
			}),
		)
		.output(t.View)
		.mutation(async ({ input }) => {
			const r = await utilResource.resourceModify<t.View_t>(
				input,
				utilResource.getViewsJsonFile(),
				utilResource.getViewsJson,
				'views',
			)

			return r
		}),
	viewRename: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				newName: t.String,
			}),
		)
		.output(z.void())
		.mutation(async ({ input }) => {
			const rJsonFile = utilResource.getViewsJsonFile()
			const rJson = await utilResource.getViewsJson()

			rJson.views[input.uuid].name = input.newName
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))
		}),
	viewList: trpc.procedure
		.input(z.void())
		.output(
			z.object({
				views: z.array(t.View),
			}),
		)
		.query(async () => {
			const rJson = await utilResource.getViewsJson()

			// work
			const views: t.View_t[] = []
			for (const [uuid, obj] of Object.entries(rJson.views)) {
				views.push({
					uuid,
					...obj,
				})
			}
			return { views }
		}),

	pluginList: trpc.procedure
		.input(
			z
				.object({
					kind: z.string().optional(),
				})
				.optional(),
		)
		.output(
			z.object({
				plugins: z.array(t.Plugin),
			}),
		)
		.query(async ({ input }) => {
			let plugins = await utilPlugin.getPluginList()

			if (input?.kind) {
				plugins = plugins.filter((p) => p.kind === input.kind)
			}

			return { plugins }
		}),
	pluginQuery: trpc.procedure
		.input(z.object({ query: t.String }))
		.output(z.object({ result: t.String }))
		.query(({ input }) => {
			return {
				result: input.query,
			}
		}),
})

export const bareAppRouter = trpc.router({
	core: coreRouter,
})
export type BareAppRouter = typeof bareAppRouter
