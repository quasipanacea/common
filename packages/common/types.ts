import { z } from 'zod'
import type cytoscape from 'cytoscape'
import type { Router } from 'oak/mod.ts'
import type { AnyProcedure, AnyRouter } from '@trpc/server'

// Shared: Zod Schema
export const Uuid = z.string().min(1)
export const Id = z.string().min(1)
export const String = z.string().min(1)

// Shared: Family
export const pluginFamilySingular = [
	'overview',
	'model',
	'modelview',
	'pod',
	'podview',
	'theme',
	'pack',
] as const
export const PluginFamilySingular = z.enum(pluginFamilySingular)
export type PluginFamilySingular_t = z.infer<typeof PluginFamilySingular>

export const pluginFamilyPlural = [
	'overviews',
	'models',
	'modelviews',
	'pods',
	'podviews',
	'themes',
	'packs',
] as const
export const PluginFamilyPlural = z.enum(pluginFamilyPlural)
export type PluginFamilyPlural_t = z.infer<typeof PluginFamilyPlural>

// Shared: Type
type Metadata_t = {
	family: z.infer<typeof PluginFamilySingular>
	id: string
}
type BareIsomorphicPlugin_t = {
	metadata: {
		family: z.infer<typeof PluginFamilySingular>
		id: string
	}
}
type BareServerPlugin_t = {
	metadata: BareIsomorphicPlugin_t['metadata']
	trpcRouter?: AnyProcedure | AnyRouter
	oakRouter?: Router
}

// Object: Zod Schema
export const Orb = z.object({
	uuid: Uuid,
	name: String.optional(),
	model: z.object({
		uuid: Uuid,
	}),
	pod: z
		.object({
			uuid: Uuid,
		})
		.optional(),
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
export const Link = z.object({
	uuid: Uuid,
	name: String.optional(),
	source: z.object({
		resource: String,
		uuid: Uuid,
	}),
	target: z.object({
		resource: String,
		uuid: Uuid,
	}),
	extra: z.object({}).optional(),
})
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
export const Modelview = z.object({
	uuid: Uuid,
	name: String.optional(),
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
export const Podview = z.object({})
export const Plugin = z.object({
	id: Id,
	family: PluginFamilySingular,
})

// Object: Type
export type Orb_t = z.infer<typeof Orb>
export type Link_t = z.infer<typeof Link>
export type Model_t = z.infer<typeof Model>
export type Modelview_t = z.infer<typeof Modelview>
export type Pod_t = z.infer<typeof Pod>
export type Podview_t = z.infer<typeof Podview>
export type Plugin_t = z.infer<typeof Plugin>

// JSON File: Zod Schema
export const SchemaOverviewsJson = z.object({})
export const SchemaOrbsJson = z.object({
	orbs: z.record(Uuid, Orb.omit({ uuid: true })),
})
export const SchemaLinksJson = z.object({
	links: z.record(Uuid, Link.omit({ uuid: true })),
})
export const SchemaModelsJson = z.object({
	models: z.record(Uuid, Model.omit({ uuid: true })),
})
export const SchemaModelviewsJson = z.object({
	modelviews: z.record(Uuid, Modelview.omit({ uuid: true })),
})
export const SchemaPodsJson = z.object({
	pods: z.record(Uuid, Pod.omit({ uuid: true })),
})
export const SchemaPodviewsJson = z.object({
	podviews: z.record(Uuid, Podview.omit({ uuid: true })),
})
export const SchemaThemesJson = z.object({})
export const SchemaPacksJson = z.object({})
export const SchemaSettingsJson = z
	.object({
		defaultOverview: z.string(),
		mimes: z.object({
			pod: z.record(z.string(), z.string()),
			podview: z.record(z.string(), z.string()),
			model: z.record(z.string(), z.string()),
			modelview: z.record(z.string(), z.string()),
		}),
	})
	.deepPartial()
export const SchemaIndexJson = z
	.object({
		mimes: z.object({
			pod: z.record(z.string(), z.array(z.string())),
			podview: z.record(z.string(), z.array(z.string())),
			model: z.record(z.string(), z.array(z.string())),
			modelview: z.record(z.string(), z.array(z.string())),
		}),
	})
	.deepPartial()

// JSON File: Type
export type SchemaOrbsJson_t = z.infer<typeof SchemaOrbsJson>
export type SchemaLinksJson_t = z.infer<typeof SchemaLinksJson>
export type SchemaModelsJson_t = z.infer<typeof SchemaModelsJson>
export type SchemaModelviewsJson_t = z.infer<typeof SchemaModelviewsJson>
export type SchemaPodsJson_t = z.infer<typeof SchemaPodsJson>
export type SchemaPodviewsJson_t = z.infer<typeof SchemaPodviewsJson>
export type SchemaSettingsJson_t = z.infer<typeof SchemaSettingsJson>
export type SchemaIndexJson_t = z.infer<typeof SchemaIndexJson>

// Isomorphic Plugins: Type
export type AnyIsomorphicPlugin_t =
	| OverviewIsomorphicPlugin_t
	| ModelIsomorphicPlugin_t
	| ModelviewIsomorphicPlugin_t
	| PodIsomorphicPlugin_t
	| PodviewIsomorphicPlugin_t
	| ThemeIsomorphicPlugin_t
	| PackIsomorphicPlugin_t
export type OverviewIsomorphicPlugin_t = BareIsomorphicPlugin_t
export type ModelIsomorphicPlugin_t = {
	metadata: Metadata_t & { format: string }
}
export type ModelviewIsomorphicPlugin_t = {
	metadata: Metadata_t & { format: string }
}
export type PodIsomorphicPlugin_t = {
	metadata: Metadata_t & { format: string }
}
export type PodviewIsomorphicPlugin_t = {
	metadata: Metadata_t & { format: string }
}
export type ThemeIsomorphicPlugin_t = BareIsomorphicPlugin_t
export type PackIsomorphicPlugin_t = BareIsomorphicPlugin_t

// Client Plugins: Type
export type AnyClientPlugin_t =
	| OverviewClientPlugin_t
	| ModelClientPlugin_t
	| ModelviewClientPlugin_t
	| PodClientPlugin_t
	| PodviewClientPlugin_t
	| ThemeClientPlugin_t
	| PackClientPlugin_t
export type ClientPluginMap_t = {
	overview: OverviewClientPlugin_t
	model: ModelClientPlugin_t
	modelview: ModelviewClientPlugin_t
	pod: PodClientPlugin_t
	podview: PodviewClientPlugin_t
	theme: ThemeClientPlugin_t
	pack: PackClientPlugin_t
}
export type OverviewClientPlugin_t = {
	metadata: Metadata_t
	component: unknown
}
export type ModelClientPlugin_t = {
	metadata: Metadata_t
	component: unknown
	arrangeElements: (
		arg0: Model_t,
		arg1: Pod_t[],
		arg2: Orb_t[],
	) => { elements: cytoscape.ElementDefinition[] }
	validateNewChild: () => boolean
}
export type ModelviewClientPlugin_t = {
	component: unknown
}
export type PodClientPlugin_t = {
	metadata: Metadata_t
	component: unknown
}
export type PodviewClientPlugin_t = {
	metadata: Metadata_t
	component: unknown
}
export type ThemeClientPlugin_t = {
	metadata: Metadata_t
}
export type PackClientPlugin_t = {
	metadata: Metadata_t
	initAll: () => {}
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
	) => State | Promise<State>
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
export type AnyServerPlugin_t =
	| OverviewServerPlugin_t
	| ModelServerPlugin_t
	| ModelviewServerPlugin_t
	| PodServerPlugin_t
	| PodviewServerPlugin_t
	| ThemeServerPlugin_t
	| PackServerPlugin_t
export type ServerPluginMap_t = {
	overview: OverviewServerPlugin_t
	model: ModelServerPlugin_t
	modelview: ModelviewServerPlugin_t
	pod: PodServerPlugin_t
	podview: PodviewServerPlugin_t
	theme: ThemeServerPlugin_t
	pack: PackServerPlugin_t
}
export type OverviewServerPlugin_t = BareServerPlugin_t
export type ModelServerPlugin_t = BareServerPlugin_t
export type ModelviewServerPlugin_t = BareServerPlugin_t
export type PodServerPlugin_t = {
	metadata: PodIsomorphicPlugin_t['metadata']
	trpcRouter?: AnyProcedure | AnyRouter
	oakRouter?: Router
	hooks?: Hooks<keyof HooksTable, Record<string, unknown>>
}
export type PodviewServerPlugin_t = {
	metadata: PodIsomorphicPlugin_t['metadata']
	trpcRouter?: AnyProcedure | AnyRouter
	oakRouter?: Router
	hooks?: Hooks<keyof HooksTable, Record<string, unknown>>
}
export type ThemeServerPlugin_t = BareServerPlugin_t
export type PackServerPlugin_t = BareServerPlugin_t & {
	initAll: () => Promise<unknown[]>
}

// Client
export const NodeLayout = z.object({
	data: z.object({
		id: z.string(),
		label: z.string().optional(),
		my: z
			.object({
				resource: z.string(),
				groupUuid: z.string().optional(),
				podUuid: z.string().optional(),
			})
			.optional(),
	}),
	position: z.object({
		x: z.number(),
		y: z.number(),
	}),
})

export type CytoscapeElementJson = {
	classes?: string
	data: CytoscapeElementData
	grabbable: boolean
	group: string
	locked: boolean
	pannable: boolean
	position: {
		x: number
		y: number
	}
	removed: boolean
	selectable: boolean
	selected: boolean
}

export type CytoscapeElementData =
	| {
			id?: string
			label?: string
			resource: 'orb'
			resourceData: Orb_t
	  }
	| {
			id?: string
			label?: string
			resource: 'link'
			resourceData: Link_t
	  }
	| {
			id?: string
			label?: string
			resource: 'pod'
			resourceData: Pod_t
	  }
	| {
			id?: string
			label?: string
			resource: 'model'
			resourceData: Model_t
	  }
