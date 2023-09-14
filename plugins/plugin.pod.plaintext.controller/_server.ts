import { pluginServer } from '@quasipanacea/common/server/index.ts'

import { metadata, format } from './_isomorphic.ts'
import * as exports from './podPlaintext.ts'

export async function init() {
	pluginServer.register({
		metadata,
		podController: {
			...exports,
		},
	})
}