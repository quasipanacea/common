import { z } from './mod.ts'
import {
	type Router,
	type AnyProcedure,
	type AnyRouter,
} from '../../../src/mod.ts'

export const Uuid = z.string().min(1)
export const Id = z.string().min(1)
export const String = z.string().min(1)

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
			'model.flat': z // TODO
				.object({
					description: z.string(),
					tags: z.array(String),
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
export const View = z.object({
	uuid: Uuid,
	name: String,
	plugin: Id,
	model: z.object({
		uuid: Uuid,
	}),
})
export const Plugin = z.object({
	id: Id,
	kind: String,
	dir: String,
})

// Object: Type
export type Orb_t = z.infer<typeof Orb>
export type Link_t = z.infer<typeof Link>
export type Model_t = z.infer<typeof Model>
export type Pod_t = z.infer<typeof Pod>
export type PodDir_t = z.infer<typeof PodDir>
export type View_t = z.infer<typeof View>
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
export const SchemaPodsJson = z.object({
	pods: z.record(Uuid, Pod.omit({ uuid: true })),
})
export const SchemaViewsJson = z.object({
	views: z.record(Uuid, View.omit({ uuid: true })),
})
export const SchemaIndexJson = z.object({
	formats: z.record(z.string(), z.array(z.string())),
})

// JSON File: Type
export type SchemaOrbsJson_t = z.infer<typeof SchemaOrbsJson>
export type SchemaLinksJson_t = z.infer<typeof SchemaLinksJson>
export type SchemaModelsJson_t = z.infer<typeof SchemaModelsJson>
export type SchemaPodsJson_t = z.infer<typeof SchemaPodsJson>
export type SchemaViewsJson_t = z.infer<typeof SchemaViewsJson>
export type SchemaIndexJson_t = z.infer<typeof SchemaIndexJson>

// Isomorphic Plugins: Zod Schema
export const AnyIsomorphicPlugin = z.object({
	kind: z.enum(['overview', 'pod', 'model', 'view']),
	id: z.string(),
})
export const OverviewIsomorphicPlugin = AnyIsomorphicPlugin
export const PodIsomorphicPlugin = z.intersection(
	AnyIsomorphicPlugin,
	z.object({
		forFormat: Id,
	}),
)
export const ModelIsomorphicPlugin = AnyIsomorphicPlugin
export const ViewIsomorphicPlugin = AnyIsomorphicPlugin
export const PackIsomorphicPlugin = AnyIsomorphicPlugin

// Isomorphic Plugins: Type
export type AnyIsomorphicPlugin_t = z.infer<typeof AnyIsomorphicPlugin>
export type OverviewIsomorphicPlugin_t = z.infer<
	typeof OverviewIsomorphicPlugin
>
export type PodIsomorphicPlugin_t = z.infer<typeof PodIsomorphicPlugin>
export type ModelIsomorphicPlugin_t = z.infer<typeof ModelIsomorphicPlugin>
export type ViewIsomorphicPlugin_t = z.infer<typeof ViewIsomorphicPlugin>
export type PackIsomorphicPlugin_t = z.infer<typeof PackIsomorphicPlugin>

// Client Plugins: Zod Schema
export const AnyClientPlugin = z.object({
	metadata: AnyIsomorphicPlugin,
	component: z.unknown(),
})
export const OverviewClientPlugin = z.object({
	metadata: OverviewIsomorphicPlugin,
	component: z.unknown(),
})
export const PodClientPlugin = z.object({
	metadata: PodIsomorphicPlugin,
	component: z.unknown(),
})
export const ModelClientPlugin = z.object({
	metadata: ModelIsomorphicPlugin,
	component: z.unknown(),
	arrangeElements: z
		.function()
		.args(Model, z.array(Pod), z.array(Orb))
		.returns(z.array(z.object({ elements: z.unknown() }))),
	validateNewChild: z.function().args().returns(z.boolean()),
})
export const ViewClientPlugin = z.object({
	metadata: ViewIsomorphicPlugin,
	component: z.unknown(),
})
export const PackClientPlugin = z.object({
	metadata: PackIsomorphicPlugin,
	initAll: z.function(),
})

// Client Plugins: Type
export type AnyClientPlugin_t = z.infer<typeof AnyClientPlugin>
export type OverviewClientPlugin_t = z.infer<typeof OverviewClientPlugin>
export type PodClientPlugin_t = z.infer<typeof PodClientPlugin>
export type ModelClientPlugin_t = z.infer<typeof ModelClientPlugin>
export type ViewClientPlugin_t = z.infer<typeof ViewClientPlugin>
export type PackClientPlugin_t = z.infer<typeof PackClientPlugin>

// Server Plugins: Type
export type Hooks<State extends Record<string, unknown>> = {
	makeState?: (pod: PodDir_t) => State | Promise<State>
	onPodAdd?: (pod: PodDir_t, state: State) => void | Promise<void>
	onPodRemove?: (pod: PodDir_t, state: State) => void | Promise<void>
}
export type AnyServerPlugin_t = {
	metadata: z.infer<typeof AnyIsomorphicPlugin>
	trpcRouter?: AnyProcedure | AnyRouter
	oakRouter?: Router
}
export type OverviewServerPlugin_t = AnyServerPlugin_t
export type PodServerPlugin_t = {
	metadata: z.infer<typeof PodIsomorphicPlugin>
	hooks?: Hooks<Record<string, unknown>>
	trpcRouter?: AnyProcedure | AnyRouter
	oakRouter?: Router
}
export type ModelServerPlugin_t = AnyServerPlugin_t
export type ViewServerPlugin_t = AnyServerPlugin_t
export type PackServerPlugin_t = {
	metadata: z.infer<typeof PackIsomorphicPlugin>
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
