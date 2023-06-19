import { registerPlugin } from "@quasipanacea/common/client/plugin.ts"

import { metadata } from "./_isomorphic.ts"
import { default as component } from "./ViewList.vue"

export async function init() {
	await registerPlugin({
		metadata,
		component
	})
}
