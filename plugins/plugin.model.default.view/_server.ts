import { pluginServer } from '@quasipanacea/common/server/index.ts'

import { metadata, format } from './_isomorphic.ts'
import * as Exports from './modelviewDefault.ts'

export async function init() {
	pluginServer.register({
		metadata,
		modelController: {
			format,
			...Exports,
		},
	})
}
