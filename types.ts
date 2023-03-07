import { z } from "~zod";

export const Uuid = z.string().min(1);
export const Id = z.string().min(1);
export const String = z.string().min(1);

export const CollectionPluginId = z.union([
	z.literal("debug"),
	z.literal("line"),
]);
export type CollectionPluginId_t = z.infer<typeof CollectionPluginId>;

export const OverviewPluginId = z.union([
	z.literal("by-collection"),
	z.literal("column"),
	z.literal("debug"),
	z.literal("graph"),
]);
export type OverviewPluginId_t = z.infer<typeof OverviewPluginId>;

export const PodPluginId = z.union([
	z.literal("debug"),
	z.literal("markdown"),
	z.literal("nil"),
	z.literal("plaintext"),
	z.literal("latex"),
]);
export type PodPluginId_t = z.infer<typeof PodPluginId>;

export const Pod = z.object({
	uuid: Uuid,
	name: String,
	pluginId: Id,
	collectionUuid: Uuid,
});
export type Pod_t = z.infer<typeof Pod>;

export const PodDir = z.intersection(
	Pod,
	z.object({
		dir: String,
	})
);
export type PodDir_t = z.infer<typeof PodDir>;

export const Collection = z.object({
	uuid: Uuid,
	name: String,
	pluginId: Id,
});
export type Collection_t = z.infer<typeof Collection>;

export const Plugin = z.object({
	id: Id,
	kind: z.union([
		z.literal("collection"),
		z.literal("overview"),
		z.literal("pod"),
	]),
	dir: String,
});

export type Plugin_t = z.infer<typeof Plugin>;

// Module

export type MakeState<State extends Record<string, unknown>> = (
	pod: PodDir_t
) => State;

export type Hooks<State extends Record<string, unknown>> = {
	makeState?: (pod: PodDir_t) => State | Promise<State>;
	onPodAdd?: (pod: PodDir_t, state: State) => void | Promise<void>;
	onPodRemove?: (pod: PodDir_t, state: State) => void | Promise<void>;
};

export type PluginModule = {
	hooks: Hooks<Record<string, unknown>>;
	router: unknown;
};
