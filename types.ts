import { z } from "~zod";

export const uuid_t = z.string().min(1);
export const id_t = z.string().min(1);
export const name_t = z.string().min(1);
export const string_t = z.string().min(1);

export const zodPod = z.object({
	uuid: uuid_t,
	name: name_t,
	owningPlugin: uuid_t,
	owningCollection: uuid_t,
});
export type Pod = z.infer<typeof zodPod>;

export const zodCollection = z.object({
	uuid: uuid_t,
	name: name_t,
	owningPlugin: string_t,
});
export type Collection = z.infer<typeof zodCollection>;

export const zodPlugin = z.object({
	id: id_t,
	filename: string_t,
	kind: string_t,
});

export type Plugin = z.infer<typeof zodPlugin>;
