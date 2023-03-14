import { z } from "~zod";

export const Uuid = z.string().min(1);
export const Id = z.string().min(1);
export const String = z.string().min(1);

export const GroupPluginId = z.union([z.literal("debug"), z.literal("line")]);
export type GroupPluginId_t = z.infer<typeof GroupPluginId>;

export const OverviewPluginId = z.union([
	z.literal("by-group"),
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
	groupUuid: Uuid,
});
export type Pod_t = z.infer<typeof Pod>;

export const PodDir = z.intersection(
	Pod,
	z.object({
		dir: String,
	})
);
export type PodDir_t = z.infer<typeof PodDir>;

export const Cover = z.object({
	uuid: Uuid,
	name: String,
	pluginId: Id,
	groupUuid: Uuid,
});
export type Cover_t = z.infer<typeof Cover>;

export const Group = z.object({
	uuid: Uuid,
	name: String,
	pluginId: Id,
});
export type Group_t = z.infer<typeof Group>;

export const Plugin = z.object({
	id: Id,
	kind: z.union([
		z.literal("group"),
		z.literal("overview"),
		z.literal("pod"),
		z.literal("cover"),
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
