import { z } from 'zod'
import { default as _ } from 'lodash'
import * as fs from 'node:fs/promises'

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
			await fs.writeFile(settingsJsonFile, util.jsonStringify(settingsJson))
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
					family: t.ResourceNamesSingular.optional(),
				})
				.optional(),
		)
		.output(
			z.object({
				plugins: z.array(t.PluginMetadata),
			}),
		)
		.query(({ input }) => {
			let plugins: t.ServerPluginModule_t[] = []

			if (input?.family) {
				plugins = plugins.filter((item) => {
					if (input.family === 'overview') {
						return !!item.overview
					} else if (input.family === 'model') {
						return !!item.modelController
					} else if (input.family === 'pod') {
						return !!item.podController
					} else {
						return true
					}
				})
			}

			return { plugins: plugins.map((item) => item.metadata) }
		}),
})

const bareAppRouter = trpc.router({
	core: coreRouter,
})
export type BareAppRouter = typeof bareAppRouter
