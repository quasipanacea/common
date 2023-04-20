export * from './_isomorphic.ts'
export { default as component } from './AnchorGroupSimple.vue'

import type * as t from '@quasipanacea/common/types.ts'
import type cytoscape from 'cytoscape'

export function arrangeElements(anchor: t.Anchor_t, orbs: t.Orb_t[]): cytoscape.ElementDefinition[] {
	return [
		{
			group: 'nodes',
			data: {
				id: 'a',
				label: 'orb',
				anchor: {
					uuid: anchor.uuid
				}
			}
		}
	]
}
