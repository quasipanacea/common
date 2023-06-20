import { init as PodChemical } from '@quasipanacea/pod-chemical/_server.ts'
import { init as PodDebug } from '@quasipanacea/pod-debug/_server.ts'
import { init as PodLatex } from '@quasipanacea/pod-latex/_server.ts'
import { init as PodMarkdown } from '@quasipanacea/pod-markdown/_server.ts'
import { init as PodMilkdown } from '@quasipanacea/pod-milkdown/_server.ts'
import { init as PodPlaintext } from '@quasipanacea/pod-plaintext/_server.ts'

export { metadata } from './_isomorphic.ts'

export async function initAll() {
	await Promise.all([
		PodChemical(),
		PodDebug(),
		PodLatex(),
		PodMarkdown(),
		PodMilkdown(),
		PodPlaintext(),
	])
}
