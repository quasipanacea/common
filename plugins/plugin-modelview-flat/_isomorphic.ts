import { t } from '@quasipanacea/common/index.ts'
import { z } from 'zod'

export const metadata: t.ModelviewIsomorphicPlugin_t['metadata'] = {
	id: 'flat',
	family: 'modelview',
	format: 'x-multipart/x-flat',
}

export const Typings = z.object({
	description: z.string(),
	tags: z.array(t.String),
})
export type Typings_t = z.infer<typeof Typings>

export namespace Foo {
	export interface PodExtras {
		extendedKey: string
		'plugin-model-flat': Typings_t
	}
}
