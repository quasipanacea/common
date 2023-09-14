import { pluginClient } from '@quasipanacea/common/client/index.js'

import { metadata, format } from './_isomorphic.ts'
import { default as component } from './OverviewDebug.vue'

export async function init() {
	pluginClient.register({
		metadata,
		overview: {
			component,
		},
	})
}
