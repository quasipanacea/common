import {
	createTRPCProxyClient,
	type CreateTRPCClientOptions,
	httpBatchLink,
} from '@trpc/client'
import type { AnyRouter } from '@trpc/server'

import type { BareAppRouter } from '../routes.ts'

export type { BareAppRouter }

export function useApi2<T extends AnyRouter>(
	proxyClientOptions: CreateTRPCClientOptions<T>,
) {
	return createTRPCProxyClient(proxyClientOptions)
}

export function useApi3<T extends AnyRouter>() {
	return createTRPCProxyClient<T>({
		links: [
			httpBatchLink({
				url: '/trpc',
			}),
		],
	} as CreateTRPCClientOptions<T>)
}
