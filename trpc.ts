import { initTRPC } from "~trpc-server";
import type { FetchCreateContextFnOptions } from "~trpc-server/adapters/fetch";

import type * as t from '@common/types'

type Context = {
	universalValue: string,
	pod?: t.PodDir_t
	state?: any // TODO
}

export async function createContext(_opts: FetchCreateContextFnOptions): Promise<Context> {
	return {
		universalValue: await Promise.resolve("pie"),
	};
}

export const trpc = initTRPC.context<typeof createContext>().create();
