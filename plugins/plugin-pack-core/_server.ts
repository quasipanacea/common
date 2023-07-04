import { init as OverviewGraph } from '@quasipanacea/plugin-overview-graph/_server.ts'

import { init as PodChemical } from '@quasipanacea/plugin-pod-chemical/_server.ts'
import { init as PodDebug } from '@quasipanacea/plugin-pod-debug/_server.ts'
import { init as PodExcalidraw } from '@quasipanacea/plugin-pod-excalidraw/_server.ts'
import { init as PodFlashcard } from '@quasipanacea/plugin-pod-flashcard/_server.ts'
import { init as PodLatex } from '@quasipanacea/plugin-pod-latex/_server.ts'
import { init as PodMarkdown } from '@quasipanacea/plugin-pod-markdown/_server.ts'
import { init as PodMilkdown } from '@quasipanacea/plugin-pod-milkdown/_server.ts'
import { init as PodPlaintext } from '@quasipanacea/plugin-pod-plaintext/_server.ts'

export { metadata } from './_isomorphic.ts'

export async function initAll() {
	await Promise.all([
		OverviewGraph(),
		PodChemical(),
		PodDebug(),
		PodExcalidraw(),
		PodFlashcard(),
		PodLatex(),
		PodMarkdown(),
		PodMilkdown(),
		PodPlaintext(),
	])
}
