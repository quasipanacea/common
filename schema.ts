import { z } from "zod";

/* ---------------------- document ---------------------- */

// documentRead
export const documentCreateReq = z.object({
	type: z.enum(["type-regular", "type-unique"]),
	name: z.string().min(1),
});
export const documentCreateRes = z.object({});
export type documentCreateReqType = z.infer<typeof documentCreateReq>;
export type documentCreateResType = z.infer<typeof documentCreateRes>;

// documentRead
export const documentReadReq = z.object({
	type: z.enum(["type-regular", "type-unique"]),
	name: z.string().min(1),
});
export const documentReadRes = z.object({});

export type documentReadReqType = z.infer<typeof documentReadReq>;
export type documentReadResType = z.infer<typeof documentReadRes>;

// documentWrite
export const documentWriteReq = z.object({
	type: z.enum(["type-regular", "type-unique"]),
	name: z.string().min(1),
	content: z.string(),
});
export const documentWriteRes = z.object({});
export type documentWriteReqType = z.infer<typeof documentWriteReq>;
export type documentWriteResType = z.infer<typeof documentWriteRes>;

// documentDelete
export const documentDeleteReq = z.object({
	type: z.enum(["type-regular", "type-unique"]),
	name: z.string().min(1),
});
export const documentDeleteRes = z.object({});
export type documentDeleteReqType = z.infer<typeof documentDeleteReq>;
export type documentDeleteResType = z.infer<typeof documentDeleteRes>;

// documentList
export const documentListReq = z.object({
	type: z.enum(["type-regular", "type-unique"]),
});
export const documentListRes = z.object({
	documents: z.array(
		z.object({
			name: z.string().min(1),
		})
	),
});
export type documentListReqType = z.infer<typeof documentListReq>;
export type documentListResType = z.infer<typeof documentListRes>;
