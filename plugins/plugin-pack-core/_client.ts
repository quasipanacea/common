import { init as OverviewDebug } from '@quasipanacea/plugin-overview-debug/_client.js'
import { init as OverviewGraph } from '@quasipanacea/plugin-overview-graph/_client.js'
import { init as OverviewMindelixir } from '@quasipanacea/plugin-overview-mindelixir/_client.js'

import { init as ModelDefault } from '@quasipanacea/plugin-model-default/_client.ts'
import { init as ModelFlat } from '@quasipanacea/plugin-model-flat/_client.ts'
import { init as ModelColors } from '@quasipanacea/plugin-model-colors/_client.ts'
import { init as ModelLine } from '@quasipanacea/plugin-model-line/_client.js'

import { init as ViewList } from '@quasipanacea/plugin-view-list/_client.js'
import { init as ViewMarkmap } from '@quasipanacea/plugin-view-markmap/_client.js'

import { init as PodChemical } from '@quasipanacea/plugin-pod-chemical/_client.js'
import { init as PodDebug } from '@quasipanacea/plugin-pod-debug/_client.js'
import { init as PodExcalidraw } from '@quasipanacea/plugin-pod-excalidraw/_client.js'
import { init as PodFlashcard } from '@quasipanacea/plugin-pod-flashcard/_client.js'
import { init as PodLatex } from '@quasipanacea/plugin-pod-latex/_client.js'
import { init as PodMarkdown } from '@quasipanacea/plugin-pod-markdown/_client.js'
import { init as PodMilkdown } from '@quasipanacea/plugin-pod-milkdown/_client.js'
import { init as PodPlaintext } from '@quasipanacea/plugin-pod-plaintext/_client.js'

export { metadata } from './_isomorphic.ts'

export async function initAll() {
	await Promise.all([
		OverviewDebug(),
		OverviewGraph(),
		OverviewMindelixir(),
		ModelDefault(),
		ModelFlat(),
		ModelColors(),
		ModelLine(),
		ViewList(),
		ViewMarkmap(),
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
