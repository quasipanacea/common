import { plugin } from '@quasipanacea/common/client/index.js'

import { metadata } from './_isomorphic.ts'
import { default as component } from './OverviewGraph.vue'

export async function init() {
	plugin.register({
		metadata,
		component,
	})
}
