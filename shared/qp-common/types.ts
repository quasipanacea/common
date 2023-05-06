import { z } from './mod.ts'

export const Uuid = z.string().min(1)
export const Id = z.string().min(1)
export const String = z.string().min(1)

// Object: Zod Schema
export const Orb = z.object({
	uuid: Uuid,
	name: String.optional(),
	anchor: z.object({
		uuid: Uuid,
	}),
	pod: z.optional(z.object({
		uuid: Uuid
	})),
	extras: z.optional(z.object({
		position: z.optional(z.object({
			x: z.number(),
			y: z.number(),
		}))
	}))
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
	})
})

export const Anchor = z.object({
	uuid: Uuid,
	name: String.optional(),
	plugin: Id,
	extras: z.optional(z.object({
		position: z.optional(z.object({
			x: z.number(),
			y: z.number(),
		}))
	}))
})

export const Group = z.object({
	uuid: Uuid,
	name: String,
	plugin: Id,
	datas: z
		.object({
			common: z.any(),
		})
		.passthrough()
		.optional(),
})

export const Pod = z.object({
	type: z.enum(['node', 'edge']).optional(),
	uuid: Uuid,
	name: String,
	plugin: Id,
	anchor: z.object({
		uuid: Uuid,
	}).optional(), // TODO: remove optional
	groupUuid: Uuid.optional(),
	sourceUuid: Uuid.optional(),
	targetUuid: Uuid.optional(),
	extras: z.optional(z.object({
		position: z.optional(z.object({
			x: z.number(),
			y: z.number(),
		}))
	})),
	datas: z
		.object({
			common: z.any(),
		})
		.passthrough()
		.optional(),
})

export const PodDir = z.intersection(
	Pod,
	z.object({
		dir: String,
	}),
)

export const Cover = z.object({
	uuid: Uuid,
	name: String,
	plugin: Id,
	groupUuid: Uuid,
})

export const Plugin = z.object({
	id: Id,
	kind: String,
	dir: String,
})

// Object: Type
export type Orb_t = z.infer<typeof Orb>
export type Link_t = z.infer<typeof Link>
export type Anchor_t = z.infer<typeof Anchor>
export type Group_t = z.infer<typeof Group>
export type Pod_t = z.infer<typeof Pod>
export type PodDir_t = z.infer<typeof PodDir>
export type Cover_t = z.infer<typeof Cover>
export type Plugin_t = z.infer<typeof Plugin>

// JSON File: Zod Schema
export const SchemaOrbsJson = z.object({
	orbs: z.record(Uuid, Orb.omit({ uuid: true })),
})
export const SchemaLinksJson = z.object({
	links: z.record(Uuid, Link.omit({ uuid: true })),
})
export const SchemaAnchorsJson = z.object({
	anchors: z.record(Uuid, Anchor.omit({ uuid: true })),
})
export const SchemaGroupsJson = z.object({
	groups: z.record(Uuid, Group.omit({ uuid: true })),
})
export const SchemaPodsJson = z.object({
	pods: z.record(Uuid, Pod.omit({ uuid: true })),
})
export const SchemaCoversJson = z.object({
	covers: z.record(Uuid, Cover.omit({ uuid: true })),
})

// JSON File: Type
export type SchemaOrbsJson_t = z.infer<typeof SchemaOrbsJson>
export type SchemaLinksJson_t = z.infer<typeof SchemaLinksJson>
export type SchemaAnchorsJson_t = z.infer<typeof SchemaAnchorsJson>
export type SchemaGroupsJson_t = z.infer<typeof SchemaGroupsJson>
export type SchemaPodsJson_t = z.infer<typeof SchemaPodsJson>
export type SchemaCoversJson_t = z.infer<typeof SchemaCoversJson>

// Module
export type MakeState<State extends Record<string, unknown>> = (
	pod: PodDir_t,
) => State

export type Hooks<State extends Record<string, unknown>> = {
	makeState?: (pod: PodDir_t) => State | Promise<State>
	onPodAdd?: (pod: PodDir_t, state: State) => void | Promise<void>
	onPodRemove?: (pod: PodDir_t, state: State) => void | Promise<void>
}

export type PluginModule = {
	hooks: Hooks<Record<string, unknown>>
	router: unknown
}

export const PluginExportIsomorphic = z.object({
	metadata: z.object({
		kind: z.string(),
		id: z.string(),
	}),
})
export const PluginExportClient = z.object({
	component: z.any(),
	arrangeElements: z.function().args(Anchor, z.array(Pod), z.array(Orb)).returns(z.array(z.object({ elements: z.unknown() }))),
	validateNewChild: z.function().args().returns(z.boolean())
})
export const PluginExportServer = z.object({})

export type PluginExportIsomorphic_t = z.infer<typeof PluginExportIsomorphic>
export type PluginExportClient_t = z.infer<typeof PluginExportClient>
export type PluginExportServer_t = z.infer<typeof PluginExportServer>

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

export type CytoscapeElementData = {
	id?: string
	label?: string
	resource: 'orb'
	resourceData: Orb_t
} | {
	id?: string
	label?: string
	resource: 'link'
	resourceData: Link_t
} | {
	id?: string
	label?: string
	resource: 'pod',
	resourceData: Pod_t
} | {
	id?: string
	label?: string
	resource: 'anchor'
	resourceData: Anchor_t
}
