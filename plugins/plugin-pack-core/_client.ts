import { init as OverviewBasic } from '@quasipanacea/plugin-overview-basic/_client.js'
import { init as OverviewBullets } from '@quasipanacea/plugin-overview-bullets/_client.js'
import { init as OverviewDebug } from '@quasipanacea/plugin-overview-debug/_client.js'
import { init as OverviewGraph } from '@quasipanacea/plugin-overview-graph/_client.js'
import { init as OverviewMindelixir } from '@quasipanacea/plugin-overview-mindelixir/_client.js'

import { init as ModelColors } from '@quasipanacea/plugin-model-colors/_client.js'
import { init as ModelDefault } from '@quasipanacea/plugin-model-default/_client.js'
import { init as ModelFlat } from '@quasipanacea/plugin-model-flat/_client.js'
import { init as ModelGraph } from '@quasipanacea/plugin-model-graph/_client.js'
import { init as ModelLine } from '@quasipanacea/plugin-model-line/_client.js'
import { init as ModelList } from '@quasipanacea/plugin-model-list/_client.js'
import { init as ModelMarkmap } from '@quasipanacea/plugin-model-markmap/_client.js'

import { init as ModelviewColors } from '@quasipanacea/plugin-modelview-colors/_client.js'
import { init as ModelviewDefault } from '@quasipanacea/plugin-modelview-default/_client.js'
import { init as ModelviewFlat } from '@quasipanacea/plugin-modelview-flat/_client.js'
import { init as ModelviewGraph } from '@quasipanacea/plugin-modelview-graph/_client.js'
import { init as ModelviewLine } from '@quasipanacea/plugin-modelview-line/_client.js'
import { init as ModelviewList } from '@quasipanacea/plugin-modelview-list/_client.js'
import { init as ModelviewMarkmap } from '@quasipanacea/plugin-modelview-markmap/_client.js'

import { init as PodChemical } from '@quasipanacea/plugin-pod-chemical/_client.js'
import { init as PodDebug } from '@quasipanacea/plugin-pod-debug/_client.js'
import { init as PodExcalidraw } from '@quasipanacea/plugin-pod-excalidraw/_client.js'
import { init as PodFlashcard } from '@quasipanacea/plugin-pod-flashcard/_client.js'
import { init as PodLatex } from '@quasipanacea/plugin-pod-latex/_client.js'
import { init as PodMarkdown } from '@quasipanacea/plugin-pod-markdown/_client.js'
import { init as PodPlaintext } from '@quasipanacea/plugin-pod-plaintext/_client.js'

import { init as PodviewChemical } from '@quasipanacea/plugin-podview-chemical/_client.js'
import { init as PodviewDebug } from '@quasipanacea/plugin-podview-debug/_client.js'
import { init as PodviewExcalidraw } from '@quasipanacea/plugin-podview-excalidraw/_client.js'
import { init as PodviewFlashcard } from '@quasipanacea/plugin-podview-flashcard/_client.js'
import { init as PodviewLatex } from '@quasipanacea/plugin-podview-latex/_client.js'
import { init as PodviewMilkdown } from '@quasipanacea/plugin-podview-milkdown/_client.js'
import { init as PodviewPlaintext } from '@quasipanacea/plugin-podview-plaintext/_client.js'
import { init as PodviewRemark } from '@quasipanacea/plugin-podview-remark/_client.js'

export { metadata } from './_isomorphic.ts'

export async function initAll() {
	await Promise.all([
		OverviewBasic(),
		OverviewBullets(),
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
