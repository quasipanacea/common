import { init as OverviewDebug } from '@quasipanacea/plugin-overview-debug/_server.ts'
import { init as OverviewGraph } from '@quasipanacea/plugin-overview-graph/_server.ts'
import { init as OverviewMindelixir } from '@quasipanacea/plugin-overview-mindelixir/_server.ts'

import { init as ModelColors } from '@quasipanacea/plugin-model-colors/_server.ts'
import { init as ModelDefault } from '@quasipanacea/plugin-model-default/_server.ts'
import { init as ModelFlat } from '@quasipanacea/plugin-model-flat/_server.ts'
import { init as ModelGraph } from '@quasipanacea/plugin-model-graph/_server.ts'
import { init as ModelLine } from '@quasipanacea/plugin-model-line/_server.ts'
import { init as ModelList } from '@quasipanacea/plugin-model-list/_server.ts'
import { init as ModelMarkmap } from '@quasipanacea/plugin-model-markmap/_server.ts'

import { init as ModelviewColors } from '@quasipanacea/plugin-modelview-colors/_server.ts'
import { init as ModelviewDefault } from '@quasipanacea/plugin-modelview-default/_server.ts'
import { init as ModelviewFlat } from '@quasipanacea/plugin-modelview-flat/_server.ts'
import { init as ModelviewGraph } from '@quasipanacea/plugin-modelview-graph/_server.ts'
import { init as ModelviewLine } from '@quasipanacea/plugin-modelview-line/_server.ts'
import { init as ModelviewList } from '@quasipanacea/plugin-modelview-list/_server.ts'
import { init as ModelviewMarkmap } from '@quasipanacea/plugin-modelview-markmap/_server.ts'

import { init as PodChemical } from '@quasipanacea/plugin-pod-chemical/_server.ts'
import { init as PodDebug } from '@quasipanacea/plugin-pod-debug/_server.ts'
import { init as PodExcalidraw } from '@quasipanacea/plugin-pod-excalidraw/_server.ts'
import { init as PodFlashcard } from '@quasipanacea/plugin-pod-flashcard/_server.ts'
import { init as PodLatex } from '@quasipanacea/plugin-pod-latex/_server.ts'
import { init as PodMarkdown } from '@quasipanacea/plugin-pod-markdown/_server.ts'
import { init as PodPlaintext } from '@quasipanacea/plugin-pod-plaintext/_server.ts'

import { init as PodviewChemical } from '@quasipanacea/plugin-podview-chemical/_server.ts'
import { init as PodviewDebug } from '@quasipanacea/plugin-podview-debug/_server.ts'
import { init as PodviewExcalidraw } from '@quasipanacea/plugin-podview-excalidraw/_server.ts'
import { init as PodviewFlashcard } from '@quasipanacea/plugin-podview-flashcard/_server.ts'
import { init as PodviewLatex } from '@quasipanacea/plugin-podview-latex/_server.ts'
import { init as PodviewMilkdown } from '@quasipanacea/plugin-podview-milkdown/_server.ts'
import { init as PodviewPlaintext } from '@quasipanacea/plugin-podview-plaintext/_server.ts'
import { init as PodviewRemark } from '@quasipanacea/plugin-podview-remark/_server.ts'

export { metadata } from './_isomorphic.ts'

export async function initAll() {
	await Promise.all([
		OverviewDebug(),
		OverviewGraph(),
		OverviewMindelixir(),

		ModelColors(),
		ModelDefault(),
		ModelFlat(),
		ModelGraph(),
		ModelLine(),
		ModelList(),
		ModelMarkmap(),

		ModelviewColors(),
		ModelviewDefault(),
		ModelviewFlat(),
		ModelviewGraph(),
		ModelviewLine(),
		ModelviewList(),
		ModelviewMarkmap(),

		PodChemical(),
		PodDebug(),
		PodExcalidraw(),
		PodFlashcard(),
		PodLatex(),
		PodMarkdown(),
		PodPlaintext(),

		PodviewChemical(),
		PodviewDebug(),
		PodviewExcalidraw(),
		PodviewFlashcard(),
		PodviewLatex(),
		PodviewMilkdown(),
		PodviewPlaintext(),
		PodviewRemark(),
	])
}
