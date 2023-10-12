import { z } from 'zod'
import type express from 'express'
import type { AnyProcedure, AnyRouter } from '@trpc/server'

// Shared: Zod Schema
export const Uuid = z.string().min(1)
export const Id = z.string().min(1)
export const String = z.string().min(1)

// Shared: Resource Names
export const resourceNamesSingular = ['overview', 'model', 'pod'] as const
export const ResourceNamesSingular = z.enum(resourceNamesSingular)
export type ResourceNamesSingular_t = z.infer<typeof ResourceNamesSingular>

export const resourceNamesPlural = ['overviews', 'models', 'pods'] as const
export const ResourceNamesPlural = z.enum(resourceNamesPlural)
export type ResourceNamesPlural_t = z.infer<typeof ResourceNamesPlural>

// Object: Zod Schema
export const Model = z.object({
	uuid: Uuid,
	name: String.optional(),
	format: z.string(),
	extra: z
		.object({
			position: z
				.object({
					x: z.number(),
					y: z.number(),
				})
				.optional(),
		})
		.optional(),
})
export const Pod = z.object({
	uuid: Uuid,
	name: String,
	format: z.string(),
	model: z.object({
		uuid: Uuid,
	}),
	extra: z
		.object({
			position: z
				.object({
					x: z.number(),
					y: z.number(),
				})
				.optional(),
		})
		.optional(),
})

// Object: Type
export type Model_t = z.infer<typeof Model>
export type Pod_t = z.infer<typeof Pod>

// JSON File: Zod Schema
export const SchemaOverviewsJson = z.object({})
export const SchemaModelsJson = z.object({
	models: z.record(Uuid, Model.omit({ uuid: true })),
})
export const SchemaPodsJson = z.object({
	pods: z.record(Uuid, Pod.omit({ uuid: true })),
})
export const SchemaSettingsJson = z
	.object({
		defaultOverviewPlugin: z.string(),
		defaultModelFormats: z.record(
			z.string(),
			z.object({
				controllerPlugin: z.string(),
				viewPlugin: z.string(),
			}),
		),
		defaultPodFormats: z.record(
			z.string(),
			z.object({
				controllerPlugin: z.string(),
				viewPlugin: z.string(),
			}),
		),
	})
	.deepPartial()
export const SchemaIndexJson = z
	.object({
		defaultOverviewPlugin: z.array(z.string()),
		formats: z.object({
			model: z.object({
				controller: z.array(z.string()),
				view: z.array(z.string()),
			}),
			pod: z.object({
				controller: z.array(z.string()),
				view: z.array(z.string()),
			}),
		}),
	})
	.deepPartial()

// JSON File: Type
export type SchemaModelsJson_t = z.infer<typeof SchemaModelsJson>
export type SchemaPodsJson_t = z.infer<typeof SchemaPodsJson>
export type SchemaSettingsJson_t = z.infer<typeof SchemaSettingsJson>
export type SchemaIndexJson_t = z.infer<typeof SchemaIndexJson>

// Plugins: Zod Schema
export const PluginMetadata = z.object({
	id: Id,
})

// Plugins: Type
export type PluginMetadata_t = {
	id: string
}
export type ClientPluginModule_t = {
	metadata: PluginMetadata_t
	overview?: {
		component: unknown
	}
	modelView?: {
		format?: string
		component: unknown
		componentCreatePopup?: unknown
	}
	podView?: {
		format?: string
		component: unknown
	}
	theme?: {
		theme: unknown
	}
}
export type ServerPluginModule_t = {
	metadata: PluginMetadata_t
	overview?: unknown
	modelController?: {
		format?: string
		trpcRouter?: AnyProcedure | AnyRouter
		oakRouter?: (typeof express)['Router']
		hooks?: Hooks<keyof HooksTable, Record<string, unknown>>
	}
	podController?: {
		format?: string
		trpcRouter?: AnyProcedure | AnyRouter
		oakRouter?: (typeof express)['Router']
		hooks?: Hooks<keyof HooksTable, Record<string, unknown>>
	}
	theme?: {
		theme: unknown
	}
}

// Server Plugins: Type
type HooksTable = {
	model: { model: Model_t }
	pod: { pod: Pod_t }
}
export type Hooks<
	PluginFamily extends keyof HooksTable,
	State extends Record<string, unknown>,
> = {
	makeState?: (
		arg0: { dir: string } & HooksTable[PluginFamily],
	) => State | Promise<State> | void | Promise<void>
	onAdd?: (
		arg0: {
			dir: string
			state: State
		} & HooksTable[PluginFamily],
	) => void | Promise<void>
	onPod?: (
		arg0: {
			dir: string
			state: State
		} & HooksTable[PluginFamily],
	) => void | Promise<void>
}
