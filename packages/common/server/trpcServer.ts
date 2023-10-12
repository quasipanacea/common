import { initTRPC, type inferAsyncReturnType } from '@trpc/server'
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express'

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
	return {
		zero: 0,
	}
}
export type Context = inferAsyncReturnType<typeof createContext>

export const instance = initTRPC.context<Context>().create()
