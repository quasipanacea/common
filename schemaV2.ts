import { z } from "zod";

//
//
// Area
export const areaAdd_req = z.object({
	name: z.string().min(1),
});
export type areaAdd_reqT = z.infer<typeof areaAdd_req>;
export const areaAdd_res = z.object({});
export type areaAdd_resT = z.infer<typeof areaAdd_res>;

export const areaRemove_req = z.object({
	name: z.string().min(1),
});
export type areaRemove_reqT = z.infer<typeof areaRemove_req>;
export const areaRemove_res = z.object({});
export type areaRemove_resT = z.infer<typeof areaRemove_res>;

export const areaRename_req = z.object({
	oldName: z.string().min(1),
	newName: z.string().min(1),
});
export type areaRename_reqT = z.infer<typeof areaRename_req>;
export const areaRename_res = z.object({});
export type areaRename_resT = z.infer<typeof areaRename_res>;

export const areaList_req = z.object({});
export type areaList_reqT = z.infer<typeof areaList_req>;
export const areaList_res = z.object({
	areas: z.array(z.string().min(1)),
});
export type areaList_resT = z.infer<typeof areaList_res>;

//
//
// Topic
export const topicAdd_req = z.object({
	area: z.string().min(1),
	name: z.string().min(1),
});
export type topicAdd_reqT = z.infer<typeof topicAdd_req>;
export const topicAdd_res = z.object({});
export type topicAdd_resT = z.infer<typeof topicAdd_res>;

export const topicRemove_req = z.object({
	area: z.string().min(1),
	name: z.string().min(1),
});
export type topicRemove_reqT = z.infer<typeof topicRemove_req>;
export const topicRemove_res = z.object({});
export type topicRemove_resT = z.infer<typeof topicRemove_res>;

export const topicRename_req = z.object({
	area: z.string().min(1),
	oldName: z.string().min(1),
	newName: z.string().min(1),
});
export type topicRename_reqT = z.infer<typeof topicRename_req>;
export const topicRename_res = z.object({});
export type topicRename_resT = z.infer<typeof topicRename_res>;

export const topicList_req = z.object({
	area: z.string().min(1),
});
export type topicList_reqT = z.infer<typeof topicList_req>;
export const topicList_res = z.object({
	galaxies: z.array(z.string().min(1)),
});
export type topicList_resT = z.infer<typeof topicList_res>;

//
//
// note
export const noteAdd_req = z.object({
	area: z.string().min(1),
	topic: z.string().min(1),
	name: z.string().min(1),
});
export type noteAdd_reqT = z.infer<typeof noteAdd_req>;
export const noteAdd_res = z.object({});
export type noteAdd_resT = z.infer<typeof noteAdd_res>;

export const noteRemove_req = z.object({
	area: z.string().min(1),
	topic: z.string().min(1),
	name: z.string().min(1),
});
export type noteRemove_reqT = z.infer<typeof noteRemove_req>;
export const noteRemove_res = z.object({});
export type noteRemove_resT = z.infer<typeof noteRemove_res>;

export const noteRename_req = z.object({
	area: z.string().min(1),
	topic: z.string().min(1),
	oldName: z.string().min(1),
	newName: z.string().min(1),
});
export type noteRename_reqT = z.infer<typeof noteRename_req>;
export const noteRename_res = z.object({});
export type noteRename_resT = z.infer<typeof noteRename_res>;

export const noteRead_req = z.object({
	area: z.string().min(1),
	topic: z.string().min(1),
	name: z.string().min(1),
	content: z.string(),
});
export type noteRead_reqT = z.infer<typeof noteRead_req>;
export const noteRead_res = z.object({});
export type noteRead_resT = z.infer<typeof noteRead_res>;

export const noteWrite_req = z.object({
	area: z.string().min(1),
	topic: z.string().min(1),
	name: z.string().min(1),
	content: z.string(),
});
export type noteWrite_reqT = z.infer<typeof noteWrite_req>;
export const noteWrite_res = z.object({});
export type noteWrite_resT = z.infer<typeof noteWrite_res>;

export const noteQuery_req = z.object({
	area: z.string().min(1),
	topic: z.string().min(1),
	name: z.string().min(1),
	query: z.string().min(1),
});
export type noteQuery_reqT = z.infer<typeof noteQuery_req>;
export const noteQuery_res = z.object({
	result: z.string().min(1),
});
export type noteQuery_resT = z.infer<typeof noteQuery_res>;

export const noteList_req = z.object({
	area: z.string().min(1),
	topic: z.string().min(1),
});
export type noteList_reqT = z.infer<typeof noteList_req>;
export const noteList_res = z.object({
	notes: z.array(z.string().min(1)),
});
export type noteList_resT = z.infer<typeof noteList_res>;
