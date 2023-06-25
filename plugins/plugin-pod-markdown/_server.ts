import { plugin } from '@quasipanacea/common/server/index.ts'

import { metadata } from './_isomorphic.ts'
import * as exports from './podMarkdown.ts'

export async function init() {
	plugin.register({
		metadata,
		...exports,
	})
}
