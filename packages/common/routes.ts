import { z } from './mod.ts'
import { default as _ } from 'lodash' // TODO
import {
	trpcServer,
	util,
	utilResource,
	utilPlugin,
	plugin,
} from './server/index.ts'
import { t } from './index.ts'

const trpc = trpcServer.instance

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
			const orb = await utilResource.resourceModify<t.Orb_t>(
				input,
				utilResource.getOrbsJsonFile(),
				utilResource.getOrbsJson,
				'orbs',
			)

			return orb
		}),
	orbList: trpc.procedure
		.input(
			z
				.object({
					model: z.object({
						uuid: t.Uuid,
					}),
				})
				.optional(),
		)
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
			const link = await utilResource.resourceModify<t.Link_t>(
				input,
				utilResource.getLinksJsonFile(),
				utilResource.getLinksJson,
				'links',
			)

			return link
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
			const model = await utilResource.resourceModify<t.Model_t>(
				input,
				utilResource.getModelsJsonFile(),
				utilResource.getModelsJson,
				'models',
			)

			return model
		}),
	modelList: trpc.procedure
		.input(
			z
				.object({
					uuid: t.Uuid,
				})
				.optional(),
		)
		.output(
			z.object({
				models: z.array(t.Model),
			}),
		)
		.query(async ({ input }) => {
			let models = await utilResource.resourceList<t.Model_t>(
				utilResource.getModelsJson,
				'models',
			)

			if (input?.uuid) {
				models = models.filter((model) => model.uuid === input.uuid)
			}

			return { models }
		}),

	viewAdd: trpc.procedure
		.input(t.View.omit({ uuid: true }))
		.output(z.object({ uuid: t.Uuid }))
		.mutation(async ({ input }) => {
			const uuid = await utilResource.resourceAdd(
				input,
				utilResource.getViewsJsonFile(),
				utilResource.getViewsJson,
				'views',
			)

			return { uuid }
		}),
	viewRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			await utilResource.resourceRemove(
				input,
				utilResource.getViewsJsonFile(),
				utilResource.getViewsJson,
				'views',
			)
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
			const view = await utilResource.resourceModify<t.View_t>(
				input,
				utilResource.getViewsJsonFile(),
				utilResource.getViewsJson,
				'views',
			)

			return view
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

	podAdd: trpc.procedure
		.input(t.Pod.omit({ uuid: true }))
		.output(
			z.object({
				uuid: t.Uuid,
			}),
		)
		.mutation(async ({ input }) => {
			const uuid = await utilResource.resourceAdd(
				input,
				utilResource.getPodsJsonFile(),
				utilResource.getPodsJson,
				'pods',
			)

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
			await utilResource.resourceRemove(
				input,
				utilResource.getPodsJsonFile(),
				utilResource.getPodsJson,
				'pods',
			)
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
			const pod = await utilResource.resourceModify<t.Pod_t>(
				input,
				utilResource.getPodsJsonFile(),
				utilResource.getPodsJson,
				'pods',
			)

			return pod
		}),
	podModifyExtra: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				field: t.String,
				data: z.record(t.String, z.unknown()),
			}),
		)
		.output(t.Pod)
		.mutation(async ({ ctx, input }) => {
			const pod = await utilResource.resourceModifyExtra<t.Pod_t>(
				input,
				utilResource.getPodsJsonFile(),
				utilResource.getPodsJson,
				'pods',
			)

			return pod
		}),
	podList: trpc.procedure
		.input(
			z
				.object({
					uuid: t.Uuid,
					model: z.object({
						uuid: t.Uuid,
					}),
				})
				.deepPartial()
				.optional(),
		)
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

			if (input?.uuid) {
				pods = pods.filter((p) => p.uuid === input.uuid)
			}

			if (input?.model?.uuid) {
				pods = pods.filter((p) => p.model?.uuid === input?.model?.uuid)
			}

			return { pods }
		}),

	settingsGet: trpc.procedure
		.input(z.void())
		.output(t.SchemaSettingsJson)
		.query(async () => {
			const settingsJson = await utilResource.getSettingsJson()
			return settingsJson
		}),
	settingsModify: trpc.procedure
		.input(t.SchemaSettingsJson.partial())
		.output(z.void())
		.mutation(async ({ input }) => {
			let settingsJson = await utilResource.getSettingsJson()
			settingsJson = _.merge(settingsJson, input)

			const settingsJsonFile = await utilResource.getSettingsJsonFile()
			await Deno.writeTextFile(
				settingsJsonFile,
				util.jsonStringify(settingsJson),
			)
		}),

	indexGet: trpc.procedure
		.input(z.void())
		.output(t.SchemaIndexJson)
		.query(async () => {
			const indexJson = await utilResource.getIndexJson()
			return indexJson
		}),

	pluginList: trpc.procedure
		.input(
			z
				.object({
					family: z.string().optional(),
				})
				.optional(),
		)
		.output(
			z.object({
				plugins: z.array(t.Plugin),
			}),
		)
		.query(async ({ input }) => {
			let rawPlugins: t.AnyServerPlugin_t[] = []
			if (input?.family) {
				rawPlugins = Array.from(plugin.list(input.family).values())
			} else {
				for (const family of plugin.getFamilies()) {
					const arr = Array.from(plugin.list(family).values())
					rawPlugins = rawPlugins.concat(arr)
				}
			}

			const plugins = rawPlugins.map((item) => ({
				id: item.metadata.id,
				family: item.metadata.family,
			}))

			return { plugins }
		}),
})

const bareAppRouter = trpc.router({
	core: coreRouter,
})
export type BareAppRouter = typeof bareAppRouter
