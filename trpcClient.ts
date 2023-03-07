import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

import type { BareAppRouter } from '@common/routes'

export const apiObj = createTRPCProxyClient<BareAppRouter>({
	links: [
		httpBatchLink({
			url: '/trpc',
		}),
	],
})
