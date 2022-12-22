import { Router } from '../../../../src/mod.ts'
import * as send from '../../../../src/util/sendUtils.ts'
import * as podUtils from '../../../../src/util/podUtils.ts'
import * as util from '../../../../src/util/util.ts'

import * as c from './controller.ts'

export const router = new Router()

router.post('/read', async (ctx) => {
	await c.readFile()
})

router.post('/write', async (ctx) => {
	await c.writeFile()
})

router.post('/open-natively', async (ctx) => {
	await c.openNatively()
})
