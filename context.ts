import type { inferAsyncReturnType } from "npm:@trpc/server";
import type { FetchCreateContextFnOptions } from "npm:@trpc/server/adapters/fetch";

export function createContext({
	req,
	resHeaders,
}: FetchCreateContextFnOptions) {
	// const user = { name: req.headers.get("username") ?? "anonymous" };
	// return { req, resHeaders, user };
	return { req, resHeaders };
}

export type Context = inferAsyncReturnType<typeof createContext>;
