import { z } from './mod.ts'
import type cytoscape from 'cytoscape'
import {
	type Router,
	type AnyProcedure,
	type AnyRouter,
} from '../../../src/mod.ts'

// Shared: Zod Schema
export const Uuid = z.string().min(1)
export const Id = z.string().min(1)
export const String = z.string().min(1)
export const familyPlugins = [
	'overview',
	'model',
	'view',
	'pod',
	'theme',
	'pack',
] as const
export const FamilyPlugins = z.enum(familyPlugins)
export type FamilyPlugins_t = z.infer<typeof FamilyPlugins>

// Shared: Type
type Metadata_t = {
	family: z.infer<typeof FamilyPlugins>
	id: string
}
type BareIsomorphicPlugin_t = {
	metadata: {
		family: z.infer<typeof FamilyPlugins>
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
	plugin: Id,
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
export const View = z.object({
	uuid: Uuid,
	name: String,
	plugin: Id,
	model: z.object({
		uuid: Uuid,
	}),
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
export const PodDir = z.intersection(
	Pod,
	z.object({
		dir: String,
	}),
)

export const Plugin = z.object({
	id: Id,
	family: FamilyPlugins,
})

// Object: Type
export type Orb_t = z.infer<typeof Orb>
export type Link_t = z.infer<typeof Link>
export type Model_t = z.infer<typeof Model>
export type View_t = z.infer<typeof View>
export type Pod_t = z.infer<typeof Pod>
export type Plugin_t = z.infer<typeof Plugin>

// JSON File: Zod Schema
export const SchemaOrbsJson = z.object({
	orbs: z.record(Uuid, Orb.omit({ uuid: true })),
})
export const SchemaLinksJson = z.object({
	links: z.record(Uuid, Link.omit({ uuid: true })),
})
export const SchemaModelsJson = z.object({
	models: z.record(Uuid, Model.omit({ uuid: true })),
})
export const SchemaViewsJson = z.object({
	views: z.record(Uuid, View.omit({ uuid: true })),
})
export const SchemaPodsJson = z.object({
	pods: z.record(Uuid, Pod.omit({ uuid: true })),
})
export const SchemaSettingsJson = z
	.object({
		mimesToPlugin: z.record(z.string(), z.string()),
	})
	.deepPartial()
export const SchemaIndexJson = z.object({
	formats: z.record(z.string(), z.array(z.string())),
})

// JSON File: Type
export type SchemaOrbsJson_t = z.infer<typeof SchemaOrbsJson>
export type SchemaLinksJson_t = z.infer<typeof SchemaLinksJson>
export type SchemaModelsJson_t = z.infer<typeof SchemaModelsJson>
export type SchemaViewsJson_t = z.infer<typeof SchemaViewsJson>
export type SchemaPodsJson_t = z.infer<typeof SchemaPodsJson>
export type SchemaSettingsJson_t = z.infer<typeof SchemaSettingsJson>
export type SchemaIndexJson_t = z.infer<typeof SchemaIndexJson>

// Isomorphic Plugins: Type
export type AnyIsomorphicPlugin_t =
	| OverviewIsomorphicPlugin_t
	| ModelIsomorphicPlugin_t
	| ViewIsomorphicPlugin_t
	| PodIsomorphicPlugin_t
	| ThemeIsomorphicPlugin_t
	| PackIsomorphicPlugin_t
export type OverviewIsomorphicPlugin_t = BareIsomorphicPlugin_t
export type ModelIsomorphicPlugin_t = BareIsomorphicPlugin_t
export type ViewIsomorphicPlugin_t = BareIsomorphicPlugin_t
export type PodIsomorphicPlugin_t = {
	metadata: Metadata_t & { forFormat: string }
}
export type ThemeIsomorphicPlugin_t = BareIsomorphicPlugin_t
export type PackIsomorphicPlugin_t = BareIsomorphicPlugin_t

// Client Plugins: Type
export type AnyClientPlugin_t =
	| OverviewClientPlugin_t
	| ModelClientPlugin_t
	| ViewClientPlugin_t
	| PodClientPlugin_t
	| ThemeClientPlugin_t
	| PackClientPlugin_t
export type ClientPluginMap_t = {
	overview: OverviewClientPlugin_t
	model: ModelClientPlugin_t
	view: ViewClientPlugin_t
	pod: PodClientPlugin_t
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
export type ViewClientPlugin_t = {
	metadata: Metadata_t
	component: unknown
}
export type PodClientPlugin_t = {
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
	view: { view: View_t }
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
	| ViewServerPlugin_t
	| PodServerPlugin_t
	| ThemeServerPlugin_t
	| PackServerPlugin_t
export type ServerPluginMap_t = {
	overview: OverviewServerPlugin_t
	model: ModelServerPlugin_t
	view: ViewServerPlugin_t
	pod: PodServerPlugin_t
	theme: ThemeServerPlugin_t
	pack: PackServerPlugin_t
}
export type OverviewServerPlugin_t = BareServerPlugin_t
export type ModelServerPlugin_t = BareServerPlugin_t
export type ViewServerPlugin_t = BareServerPlugin_t
export type PodServerPlugin_t = {
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
