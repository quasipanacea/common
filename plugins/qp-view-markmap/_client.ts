import { registerPlugin } from "@quasipanacea/common/client/index.js"

import { metadata } from "./_isomorphic.ts"
import { default as component } from "./ViewMarkmap.vue"

export async function init() {
	await registerPlugin({
		metadata,
		component
	})
}
