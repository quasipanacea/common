import type cytoscape from 'cytoscape'

import { t } from '@quasipanacea/common/index.ts'
import { pluginClient } from '@quasipanacea/common/client/index.js'

import { metadata, format } from './_isomorphic.ts'
import { default as component } from './ModelviewDefault.vue'

export async function init() {
	pluginClient.register({
		metadata,
		modelView: {
			format,
			component,
		},
	})
}
