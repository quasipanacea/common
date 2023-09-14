import { pluginClient } from '@quasipanacea/common/client/index.js'

import { metadata, format } from './_isomorphic.ts'

export async function init() {
	pluginClient.register({
		metadata,
	})
}
