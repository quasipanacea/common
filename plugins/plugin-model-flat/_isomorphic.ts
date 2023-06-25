import { t } from '@quasipanacea/common/index.ts'
import { z } from 'zod'

export const metadata = {
	id: 'flat',
	kind: 'model',
}

export const types = z.object({
	description: z.string(),
	tags: z.array(t.String),
})
