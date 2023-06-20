import {
	createTRPCProxyClient,
	type CreateTRPCClientOptions,
	httpBatchLink,
} from '@trpc/client'
import type { AnyRouter } from '@trpc/server'

export function yieldClient<T extends AnyRouter>() {
	return createTRPCProxyClient<T>({
		links: [
			httpBatchLink({
				url: '/trpc',
			}),
		],
	} as CreateTRPCClientOptions<T>)
}

export function yieldClient2<T extends AnyRouter>(
	proxyClientOptions: CreateTRPCClientOptions<T>,
) {
	return createTRPCProxyClient(proxyClientOptions)
}
