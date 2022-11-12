import { z } from "zod";

export const documentKinds = z.enum(["KindSingle", "KindCoupled"]);
export type documentKindsType = z.infer<typeof documentKinds>;

// GROUP
// list
export const groupListRequest = z.object({});
export type groupListRequestType = z.infer<typeof groupListRequest>;
export const groupListResponse = z.object({
	groups: z.array(z.string()),
});
export type groupListResponseType = z.infer<typeof groupListResponse>;

// create
export const groupCreateRequest = z.object({
	name: z.string().min(1),
});
export type groupCreateRequestType = z.infer<typeof groupCreateRequest>;
export const groupCreateResponse = z.object({
	success: z.boolean(),
});
export type groupCreateResponseType = z.infer<typeof groupCreateResponse>;

// delete
export const groupDeleteRequest = z.object({
	name: z.string().min(1),
});
export type groupDeleteRequestType = z.infer<typeof groupDeleteRequest>;
export const groupDeleteResponse = z.object({
	success: z.boolean(),
});
export type groupDeleteResponseType = z.infer<typeof groupDeleteResponse>;

// rename
export const groupRenameRequest = z.object({
	oldName: z.string().min(1),
	newName: z.string().min(1),
});
export type groupRenameRequestType = z.infer<typeof groupRenameRequest>;
export const groupRenameResponse = z.object({
	success: z.boolean(),
});
export type groupRenameResponseType = z.infer<typeof groupRenameResponse>;

/* ---------------------- document ---------------------- */

// create single
export const documentCreateSingleRequest = z.object({
	name: z.string().min(1),
});
export type documentCreateSingleRequestType = z.infer<
	typeof documentCreateSingleRequest
>;
export const documentCreateSingleResponse = z.object({
	success: z.boolean(),
});
export type documentCreateSingleResponseType = z.infer<
	typeof documentCreateSingleResponse
>;

// create couple
export const documentCreateCoupledRequest = z.object({
	channel: z.string().min(1),
	id: z.string().min(1),
});
export type documentCreateCoupledRequestType = z.infer<
	typeof documentCreateCoupledRequest
>;
export const documentCreateCoupledResponse = z.object({
	success: z.boolean(),
});
export type documentCreateCoupledResponseType = z.infer<
	typeof documentCreateCoupledResponse
>;

// read couple
export const documentReadSingleRequest = z.object({
	name: z.string().min(1),
});
export type documentReadSingleRequestType = z.infer<
	typeof documentReadSingleRequest
>;
export const documentReadSingleResponse = z.object({
	content: z.string(),
});
export type documentReadSingleResponseType = z.infer<
	typeof documentReadSingleResponse
>;

// read couple
export const documentReadCoupleRequest = z.object({
	channel: z.string().min(1),
	id: z.string().min(1),
});
export type documentReadCoupleRequestType = z.infer<
	typeof documentReadCoupleRequest
>;
export const documentReadCoupleResponse = z.object({
	content: z.string(),
});
export type documentReadCoupleResponseType = z.infer<
	typeof documentReadCoupleResponse
>;

// write single
export const documentWriteSingleRequest = z.object({
	name: z.string().min(1),
	content: z.string(),
});
export type documentWriteSingleRequestType = z.infer<
	typeof documentWriteSingleRequest
>;

export const documentWriteSingleResponse = z.object({});
export type documentWriteSingleResponseType = z.infer<
	typeof documentWriteSingleResponse
>;

// write couple
export const documentWriteCoupleRequest = z.object({
	channel: z.string().min(1),
	id: z.string(),
	content: z.string(),
});
export type documentWriteCoupleRequestType = z.infer<
	typeof documentWriteCoupleRequest
>;
export const documentWriteCoupleResponse = z.object({});
export type documentWriteCoupleResponseType = z.infer<
	typeof documentWriteCoupleResponse
>;

// rename single
export const documentRenameSingleRequest = z.object({
	oldName: z.string().min(1),
	newName: z.string().min(1),
});
export type documentRenameSingleRequestType = z.infer<
	typeof documentRenameSingleRequest
>;
export const documentRenameSingleResponse = z.object({});
export type documentRenameSingleResponseType = z.infer<
	typeof documentRenameSingleResponse
>;

// rename couple
export const documentRenameCoupleRequest = z.object({
	channel: z.string().min(1),
	oldId: z.string().min(1),
	newId: z.string().min(1),
});
export type documentRenameCoupleRequestType = z.infer<
	typeof documentRenameCoupleRequest
>;
export const documentRenameCoupleResponse = z.object({});
export type documentRenameCoupleResponseType = z.infer<
	typeof documentRenameCoupleResponse
>;

// delete single
export const documentDeleteSingleRequest = z.object({
	name: z.string().min(1),
});
export type documentDeleteSingleRequestType = z.infer<
	typeof documentDeleteSingleRequest
>;
export const documentDeleteSingleResponse = z.object({});
export type documentDeleteSingleResponseType = z.infer<
	typeof documentDeleteSingleResponse
>;

// delete couple
export const documentDeleteCoupleRequest = z.object({
	channel: z.string().min(1),
	id: z.string().min(1),
});
export type documentDeleteCoupleRequestType = z.infer<
	typeof documentDeleteCoupleRequest
>;
export const documentDeleteCoupleResponse = z.object({});
export type documentDeleteCoupleResponseType = z.infer<
	typeof documentDeleteCoupleResponse
>;

// list single
export const documentListSingleRequest = z.object({});
export type documentListSingleRequestType = z.infer<
	typeof documentListSingleRequest
>;
export const documentListSingleResponse = z.object({
	documents: z.array(
		z.object({
			name: z.string().min(1),
		})
	),
});
export type documentListSingleResponseType = z.infer<
	typeof documentListSingleResponse
>;

// list couple
export const documentListCoupleRequest = z.object({
	channel: z.string().min(1),
});
export type documentListCoupleRequestType = z.infer<
	typeof documentListCoupleRequest
>;
export const documentListCoupleResponse = z.object({
	documents: z.array(
		z.object({
			name: z.string().min(1),
		})
	),
});
export type documentListCoupleResponseType = z.infer<
	typeof documentListCoupleResponse
>;

// query single
export const documentQuerySingleRequest = z.object({
	name: z.string().min(1),
	query: z.string().min(1),
});
export type documentQuerySingleRequestType = z.infer<
	typeof documentQuerySingleRequest
>;
export const documentQuerySingleResponse = z.object({
	value: z.string(),
});
export type documentQuerySingleResponseType = z.infer<
	typeof documentQuerySingleResponse
>;

// query couple

export const documentQueryCoupleRequest = z.object({
	channel: z.string().min(1),
	id: z.string().min(1),
	query: z.string().min(1),
});
export type documentQueryCoupleRequestType = z.infer<
	typeof documentQueryCoupleRequest
>;
export const documentQueryCoupleResponse = z.object({
	value: z.string(),
});
export type documentQueryCoupleResponseType = z.infer<
	typeof documentQueryCoupleResponse
>;
