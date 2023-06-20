import { registerPlugin } from '@quasipanacea/common/server/plugin.ts'

import { metadata } from './_isomorphic.ts'
import * as exports from './podMilkdown.ts'

export async function init() {
	registerPlugin({
		metadata,
		...exports,
	})
}
