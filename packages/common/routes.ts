import { z } from 'zod'
import { default as _ } from 'lodash'

import {
	trpcServer,
	util,
	utilResource,
	utilPlugin,
	pluginServer,
} from './server/index.ts'
import { t } from './index.ts'

const trpc = trpcServer.instance

export const coreRouter = trpc.router({
	orbAdd: trpc.procedure
		.input(t.Orb.omit({ uuid: true }))
		.output(z.object({ uuid: t.Uuid }))
		.mutation(async ({ input }) => {
			const uuid = await utilResource.resourceAdd(
				'orb',
				'orbs',
				input,
				utilResource.getOrbsJsonFile(),
				utilResource.getOrbsJson,
			)

			return { uuid }
		}),
	orbRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			await utilResource.resourceRemove(
				'orb',
				'orbs',
				input,
				utilResource.getOrbsJsonFile(),
				utilResource.getOrbsJson,
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
				'orb',
				'orbs',
				input,
				utilResource.getOrbsJsonFile(),
				utilResource.getOrbsJson,
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
				'orb',
				'orbs',
				utilResource.getOrbsJson,
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
				'link',
				'links',
				input,
				utilResource.getLinksJsonFile(),
				utilResource.getLinksJson,
			)

			return { uuid }
		}),
	linkRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			await utilResource.resourceRemove(
				'link',
				'links',
				input,
				utilResource.getLinksJsonFile(),
				utilResource.getLinksJson,
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
				'link',
				'links',
				input,
				utilResource.getLinksJsonFile(),
				utilResource.getLinksJson,
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
				'link',
				'links',
				utilResource.getLinksJson,
			)

			return { links }
		}),

	modelAdd: trpc.procedure
		.input(t.Model.omit({ uuid: true }))
		.output(z.object({ uuid: t.Uuid }))
		.mutation(async ({ input }) => {
			const uuid = await utilResource.resourceAdd(
				'model',
				'models',
				input,
				utilResource.getModelsJsonFile(),
				utilResource.getModelsJson,
			)

			return { uuid }
		}),
	modelRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			await utilResource.resourceRemove(
				'model',
				'models',
				input,
				utilResource.getModelsJsonFile(),
				utilResource.getModelsJson,
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
				'model',
				'models',
				input,
				utilResource.getModelsJsonFile(),
				utilResource.getModelsJson,
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
				'model',
				'models',
				utilResource.getModelsJson,
			)

			if (input?.uuid) {
				models = models.filter((model) => model.uuid === input.uuid)
			}

			return { models }
		}),

	modelviewAdd: trpc.procedure
		.input(t.Modelview.omit({ uuid: true }))
		.output(z.object({ uuid: t.Uuid }))
		.mutation(async ({ input }) => {
			const uuid = await utilResource.resourceAdd(
				'modelview',
				'modelviews',
				input,
				utilResource.getModelviewsJsonFile(),
				utilResource.getModelviewsJson,
			)

			return { uuid }
		}),
	modelviewRemove: trpc.procedure
		.input(z.object({ uuid: t.Uuid }))
		.output(z.void())
		.mutation(async ({ input }) => {
			await utilResource.resourceRemove(
				'modelview',
				'modelviews',
				input,
				utilResource.getModelviewsJsonFile(),
				utilResource.getModelviewsJson,
			)
		}),
	modelviewModify: trpc.procedure
		.input(
			z.object({
				uuid: t.Uuid,
				data: t.Modelview.omit({ uuid: true }).partial(),
			}),
		)
		.output(t.Modelview)
		.mutation(async ({ input }) => {
			const view = await utilResource.resourceModify<t.Modelview_t>(
				'modelview',
				'modelviews',
				input,
				utilResource.getModelviewsJsonFile(),
				utilResource.getModelviewsJson,
			)

			return view
		}),
	modelviewList: trpc.procedure
		.input(z.void())
		.output(
			z.object({
				modelviews: z.array(t.Modelview),
			}),
		)
		.query(async () => {
			const rJson = await utilResource.getModelviewsJson()

			// work
			const modelviews: t.Modelview_t[] = []
			for (const [uuid, obj] of Object.entries(rJson.modelviews)) {
				modelviews.push({
					uuid,
					...obj,
				})
			}
			return { modelviews }
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
				'pod',
				'pods',
				input,
				utilResource.getPodsJsonFile(),
				utilResource.getPodsJson,
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
				'pod',
				'pods',
				input,
				utilResource.getPodsJsonFile(),
				utilResource.getPodsJson,
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
				'pod',
				'pods',
				input,
				utilResource.getPodsJsonFile(),
				utilResource.getPodsJson,
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
				'pod',
				'pods',
				input,
				utilResource.getPodsJsonFile(),
				utilResource.getPodsJson,
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
					family: t.PluginFamilySingular.optional(),
				})
				.optional(),
		)
		.output(
			z.object({
				plugins: z.array(t.Plugin),
			}),
		)
		.query(({ input }) => {
			let rawPlugins: t.AnyServerPlugin_t[] = []
			if (input?.family) {
				rawPlugins = pluginServer.list(input.family)
			} else {
				for (const family of pluginServer.getFamilies()) {
					const arr = pluginServer.list(family)
					rawPlugins = rawPlugins.concat(arr)
				}
			}

			const plugins = rawPlugins.map((item) => item.metadata)

			return { plugins }
		}),
})

const bareAppRouter = trpc.router({
	core: coreRouter,
})
export type BareAppRouter = typeof bareAppRouter
